import { isEmpty, isLoaded, firebaseConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";

export default Page =>
  compose(
    firebaseConnect(),
    connect(state => ({
      auth: state.firebase.auth
    })),
    lifecycle({
      componentWillReceiveProps({ auth }) {
        if (isLoaded(auth) && isEmpty(auth)) {
          window.location.assign("/login");
        }
      }
    })
  )(({ auth, ...props }) => {
    return isLoaded(auth) && !isEmpty(auth) ? <Page {...props} /> : "Checking user...";
  });
