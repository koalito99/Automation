import { compose } from "recompose";
import { connect } from "react-redux";

import { STATE_TYPES } from "blondie-platform-common";

import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";

const mapStateToProps = state => ({
  types: state.firestore.data.types
});

export default compose(
  connect(mapStateToProps),
  firestoreConnectForKeys("platformId", ({ firestore, platformId }) => [
    {
      collection: "types",
      where: [
        ["state", "==", STATE_TYPES.ACTIVE],
        ["platform", "==", firestore.collection("platforms").doc(platformId)]
      ]
    }
  ])
);
