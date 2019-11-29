import { compose } from "recompose";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";

import { STATE_TYPES } from "blondie-platform-common";

import withRouterParams from "helpers/withRouterParams";
import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";

const mapStateToProps = state => ({
  relations: state.firestore.data.relations
});

export default compose(
  connect(mapStateToProps),
  withFirestore,
  withRouterParams("platformId"),
  firestoreConnectForKeys("platformId", ({ firestore, platformId }) => [
    {
      collection: "relations",
      where: [
        ["state", "==", STATE_TYPES.ACTIVE],
        ["platform", "==", firestore.collection("platforms").doc(platformId)]
      ]
    }
  ])
);
