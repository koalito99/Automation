import { compose, withProps, withState, withHandlers } from "recompose";
import { withFirestore } from "react-redux-firebase";

import withConfiguration from "helpers/withConfiguration";
import withRouterParams from "helpers/withRouterParams";
import RelatedList from "components/RelatedList";
import firebase from 'firebase/app';

export default compose(
  withFirestore,
  withConfiguration,
  withRouterParams("platformId", "id"),
  withState("expanded", "setExpanded", true),
  withState("lookupDialogOpen", "setLookupDialogOpen"),
  withState("formDialogOpen", "setFormDialogOpen"),
  withState("formDialogRecordId", "setFormDialogRecordId"),
  withState("formDialogEntityId", "setFormDialogEntityId"),
  withHandlers({
    getRelatedEntityField: ({ configuration }) => (oppositeRelationType, relation) => {
      const oppositeEntityRef = relation[oppositeRelationType];
      const fields = configuration.fields.filterByFn((field) => {
        return field.entity
          && field.entity.id === oppositeEntityRef.id
          && field.relation
          && field.relation.id === relation.id;
      });

      return _.first(fields);
    }
  }),
  withHandlers({
    onAssignClick: ({ setLookupDialogOpen }) => e => {
      e.preventDefault();
      e.stopPropagation();
      setLookupDialogOpen(true);
    },
    onLookupDialogClose: ({ setLookupDialogOpen }) => () => {
      setLookupDialogOpen(false);
    },
    onLookupSelected: ({
      firestore,
      id,
      relation,
      relationType,
      setLookupDialogOpen,
      getRelatedEntityField
    }) => entity => async () => {
      const oppositeRelationType = relationType === "source" ? "target" : "source";

      const { empty } = await firestore
          .collection('links')
          .where("relation", "==", firestore.collection("relations").doc(relation.id))
          .where(relationType, "==", firestore.collection("records").doc(id))
          .where(oppositeRelationType, "==", firestore.collection("records").doc(entity.objectID))
          .get();

      if (!empty) return;

      firestore
        .collection("links")
        .add({
          relation: firestore.collection("relations").doc(relation.id),
          [relationType]: firestore.collection("records").doc(id),
          [oppositeRelationType]: firestore.collection("records").doc(entity.objectID)
        })
        .then(console.log);

      const field = getRelatedEntityField(oppositeRelationType, relation);

      if (field) {
        firestore.collection('records').doc(entity.objectID).update({
          [field.id]: id
        });
      }

      setLookupDialogOpen(false);
    },
    onEditHandler: ({
      setFormDialogOpen,
      setFormDialogRecordId,
      setFormDialogEntityId,
    }) => (entityId, recordId) => e => {
      e.preventDefault();
      e.stopPropagation();

      setFormDialogRecordId(recordId);
      setFormDialogEntityId(entityId);
      setFormDialogOpen(true);
    },
    onFormDialogClose: ({ setFormDialogOpen }) => () => {
      setFormDialogOpen(false);
    },
    onDeleteHandler: ({
      firestore,
      id,
      relation,
      relationType,
      setLookupDialogOpen
    }) => entityId => async () => {
      const oppositeRelationType = relationType === "source" ? "target" : "source";

      const { docs: links } = await firestore
        .collection("links")
        .where("relation", "==", firestore.collection("relations").doc(relation.id))
        .where(relationType, "==", firestore.collection("records").doc(id))
        .where(oppositeRelationType, "==", firestore.collection("records").doc(entityId))
        .get();

      let promises = links.map(link =>
        firestore
          .collection("links")
          .doc(link.id)
          .delete()
      );

      promises.push(
        firestore
          .collection("records")
          .doc(entityId)
          .update({ state: "deleted" })
      );

      Promise.all(promises);

      setLookupDialogOpen(false);
    },
    onUnlinkHandler: ({
      firestore,
      id,
      relation,
      relationType,
      setLookupDialogOpen,
      getRelatedEntityField,
    }) => entityId => async () => {
      const oppositeRelationType = relationType === "source" ? "target" : "source";

      const { docs: links } = await firestore
        .collection("links")
        .where("relation", "==", firestore.collection("relations").doc(relation.id))
        .where(relationType, "==", firestore.collection("records").doc(id))
        .where(oppositeRelationType, "==", firestore.collection("records").doc(entityId))
        .get();

      Promise.all(
        links.map(link =>
          firestore
            .collection("links")
            .doc(link.id)
            .delete()
        )
      );

      const field = getRelatedEntityField(oppositeRelationType, relation);

      if (field) {
        firestore.collection('records').doc(entityId).update({
          [field.id]: firebase.firestore.FieldValue.delete()
        });
      }

      setLookupDialogOpen(false);
    }
  }),
  withProps(({ relation, relationType }) => {
    if (!relation) return;

    return {
      relationName: relationType === "source" ? relation.targetName : relation.sourceName
    };
  })
)(RelatedList);
