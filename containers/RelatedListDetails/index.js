import { compose, withState } from "recompose";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";
import { STATE_TYPES } from "blondie-platform-common";

import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";
import withLoading from "helpers/withLoading";
import withConfiguration from "helpers/withConfiguration";
import withRouterParams from "helpers/withRouterParams";
import RelatedListDetails from "components/RelatedListDetails";
import _ from 'lodash';

const mapLinksStateToProps = (state, props) => ({
  links:
    state.firestore.ordered[`links/${props.relation.id}/${props.relationType}/${props.recordId}`]
});

const mapRecordsStateToProps = (state, props) => ({
  groupedRecords: _.values(_(props.links)
    .map(link => {
      const id =
        props.relationType === "target"
          ? link.source && link.source.id
          : link.target && link.target.id;

      return {
        id,
        ...(state.firestore.data.records && state.firestore.data.records[id]),
        link
      };
    })
    .filter(record => record && record.state === STATE_TYPES.ACTIVE)
    .reduce((cum, record) => {
      const entity = props.configuration.entities.data[record.entity.id];

      if (!cum[entity.id]) {
        cum[entity.id] = {
          entity,
          records: [record]
        };
      } else {
        cum[entity.id].records.push(record);
      }

      return cum;
    }, {}))
});

export default compose(
  withFirestore,
  withConfiguration,
  withRouterParams("platformId", "id"),
  withState("expanded", "setExpanded"),
  firestoreConnectForKeys(
    "relation",
    "relationType",
    "recordId",
    ({ firestore, relation, relationType, recordId }) => {
      return [
        {
          collection: "links",
          where: [
            ["relation", "==", firestore.collection("relations").doc(relation.id)],
            [relationType, "==", firestore.collection("records").doc(recordId)]
          ],
          storeAs: `links/${relation.id}/${relationType}/${recordId}`
        }
      ];
    }
  ),
  connect(mapLinksStateToProps),
  firestoreConnectForKeys("links", ({ relationType, links }) => {
    return _(links)
      .map(link => {
        const doc =
          relationType === "target" ? link.source && link.source.id : link.target && link.target.id;

        if (!doc) return;

        return {
          collection: "records",
          doc
        };
      })
      .filter()
      .value();
  }),
  connect(mapRecordsStateToProps),
  withLoading("groupedRecords")
)(RelatedListDetails);
