import { compose } from "recompose";
import { connect } from "react-redux";

import { STATE_TYPES } from "blondie-platform-common";

import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";
import { withFirestore } from "react-redux-firebase";

const mapStateToProps = state => ({
  entities: state.firestore.data.entities || []
});

export default compose(
  connect(mapStateToProps),
  withFirestore,
  firestoreConnectForKeys("platformId", ({ firestore, platformId }) => [
    {
      collection: "entities",
      where: [
        ["state", "==", STATE_TYPES.ACTIVE],
        ["platform", "==", firestore.collection("platforms").doc(platformId)]
      ]
    }
  ])
);
