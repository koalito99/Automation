import { compose } from "recompose";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";

import { STATE_TYPES } from "blondie-platform-common";

import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";

const mapStateToProps = (state, props) => ({
  views: state.firestore.ordered[`entities/${props.entityId}/views`]
});

export default compose(
  connect(mapStateToProps),
  withFirestore,
  firestoreConnectForKeys("entityId", ({ firestore, entityId }) => [
    {
      collection: "views",
      where: [
        ["state", "==", STATE_TYPES.ACTIVE],
        ["entity", "==", firestore.collection("entities").doc(entityId)]
      ],
      storeAs: `entities/${entityId}/views`
    }
  ])
);
