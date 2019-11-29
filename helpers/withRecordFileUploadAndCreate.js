import _ from "lodash";
import { compose, withHandlers } from "recompose";
import { withFirebase, withFirestore } from "react-redux-firebase";
import withRouterParams from "./withRouterParams";
import withConfiguration from "./withConfiguration";
import Graphql from "./Graphql";
import withFileUpload from "./withFileUpload";
import withIndexing from "./withIndexing";

export default compose(
  withFirebase,
  withFirestore,
  withConfiguration,
  withRouterParams("platformId", "entityId", "id"),
  withFileUpload,
  withIndexing,
  withHandlers({
    onUpload: ({
      uploadToStorage,
      firebase,
      firestore,
      platformId,
      entityId,
      configuration,
      setIndexing,
      id,
      relation
    }) => async files => {
      let fileSourceLinkedEntityId = entityId;

      if (relation) {
        const entities = relation.source.find((entity) => entity.id === entityId) ? relation.target : relation.source;

        // @todo handle file upload and record create on polymorphic relation
        if (entities.length > 1) {
          return;
        }

        fileSourceLinkedEntityId = entities[0].id;
      }

      const source = _.toArray(configuration.sources.data).find(
        source => source.type === "file" && source.entity.id === fileSourceLinkedEntityId
      );

      if (!source) {
        return;
      }

      const graphqlClient = new Graphql(firebase, source.id);

      for (const file of files) {
        const { name, size, type, lastModifiedDate } = file;

        let params = {
          name,
          size,
          type,
          lastModifiedDate: lastModifiedDate.toISOString(),
        };

        const record = await graphqlClient.upsert("file", params, [...Object.keys(params), "id"]);
        const uploadedFile = await uploadToStorage(file, firebase, platformId, record.id);
        const recordRef = firestore.collection("records").doc(record.id);

        await recordRef.update({
          storageRefs: [uploadedFile]
        });

        setIndexing(true);

        if (relation) {
          const relationType = relation.source.find((entity) => entity.id === entityId) ? "source" : "target";
          const oppositeRelationType = relationType === "source" ? "target" : "source";

          firestore
            .collection("links")
            .add({
              relation: firestore.collection("relations").doc(relation.id),
              [relationType]: firestore.collection("records").doc(id),
              [oppositeRelationType]: firestore.collection("records").doc(record.id)
            });
        }
      }
    }
  })
);
