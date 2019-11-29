import { compose } from "recompose";
import { connect } from "react-redux";

import { STATE_TYPES } from "blondie-platform-common";

import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";

const mapStateToProps = (state, props) => ({
  items: state.firestore.ordered[`entities/${props.entityId}/records`]
});

export default compose(
  connect(mapStateToProps),
  firestoreConnectForKeys("entityId", ({ firestore, entityId }) => {
    return [
      {
        collection: `records`,
        where: [
          ["state", "==", STATE_TYPES.ACTIVE],
          ["entity", "==", firestore.collection("entities").doc(entityId)]
        ],
        storeAs: `entities/${entityId}/records`
      }
    ];
  })
);
