import { connect } from "react-redux";
import { compose } from "recompose";
import { firestoreConnect, withFirestore } from "react-redux-firebase";

import PlatformsDashboard from "components/PlatformsDashboard";

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  platforms: _.uniqBy(
    [
      ...(state.firestore.ordered.ownerPlatforms || []),
      ...(state.firestore.ordered.memberPlatforms || [])
    ],
    "id"
  ),
});

export default compose(
  connect(mapStateToProps),
  withFirestore,
  firestoreConnect(({ firestore, auth: { uid } }) => [
    {
      collection: "platforms",
      where: [["owner", "==", uid]],
      storeAs: "ownerPlatforms"
    },
    {
      collection: "platforms",
      where: [["members", "array-contains", firestore.collection("users").doc(uid)]],
      storeAs: "memberPlatforms"
    }
  ]),
)(PlatformsDashboard);
