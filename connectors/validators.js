import { compose } from "recompose";
import { connect } from "react-redux";

import { STATE_TYPES } from "blondie-platform-common";

import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";
import withRouterParams from "helpers/withRouterParams";
import { withFirestore } from "react-redux-firebase";

const mapStateToProps = state => ({
  validators: state.firestore.data.validators
});

export default compose(
  connect(mapStateToProps),
  withFirestore,
  withRouterParams("platformId"),
  firestoreConnectForKeys("platformId", ({ firestore, platformId }) => [
    {
      collection: "validators",
      where: [
        ["state", "==", STATE_TYPES.ACTIVE],
        ["platform", "==", firestore.collection("platforms").doc(platformId)]
      ]
    }
  ])
);
