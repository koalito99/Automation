import { compose } from "recompose";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";

import { STATE_TYPES } from "blondie-platform-common";

import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";

const mapStateToProps = state => ({
  permissions: state.firestore.data.permissions
});

export default compose(
  withFirestore,
  connect(mapStateToProps),
  firestoreConnectForKeys("platformId", ({ firestore, platformId }) => [
    {
      collection: "permissions",
      where: [
        ["state", "==", STATE_TYPES.ACTIVE],
        ["platform", "==", firestore.collection("platforms").doc(platformId)]
      ]
    }
  ])
);
