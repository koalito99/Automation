import React from "react";
import { connect } from "react-redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { Router } from "../../routes";
import { withSnackbar } from "notistack";
import { compose, lifecycle, withState, withHandlers, withProps } from "recompose";

import LoginPage from "components/LoginPage";

function mapStateToProps(state) {
  return { auth: state.firebase.auth };
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
  withState("email", "setEmail"),
  withState("emailError", "setEmailError"),
  withState("password", "setPassword"),
  withState("passwordError", "setPasswordError"),
  withProps(() => {
    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    return { emailRef, passwordRef };
  }),
  withSnackbar,
  withHandlers({
    onEmailChange: ({ setEmail, setEmailError }) => e => {
      setEmail(e.target.value);
      setEmailError();
    },
    onPasswordChange: ({ setPassword, setPasswordError }) => e => {
      setPassword(e.target.value);
      setPasswordError();
    },
    onSignIn: ({ firebase, email, password, setEmailError, setPasswordError }) => async e => {
      e.preventDefault();

      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);

        Router.push("/platforms");
      } catch (e) {
        switch (e.code) {
          case "auth/argument-error":
            return void setEmailError("The email is required");
          case "auth/account-exists-with-different-credential":
            return void setEmailError("The email was used in a different login type");
          case "auth/invalid-credential":
            return void setEmailError("The credential is invalid");
          case "auth/user-disabled":
            return void setEmailError("User is disabled");
          case "auth/user-not-found":
            return void setPasswordError("User cannot be found");
          case "auth/wrong-password":
            return void setPasswordError("The password is wrong");
          default:
            return void console.error(e);
        }
      }
    },
    onGoogleSignIn: ({ firebase }) => async e => {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        await firebase.auth().signInWithPopup(provider);

        Router.push("/platforms");
      } catch (e) {
        switch (e.code) {
          default:
            return void console.error(e);
        }
      }
    },
    onFacebookSignIn: ({ firebase }) => async e => {
      const provider = new firebase.auth.FacebookAuthProvider();
      try {
        await firebase.auth().signInWithPopup(provider);

        Router.push("/platforms");
      } catch (e) {
        switch (e.code) {
          default:
            return void console.error(e);
        }
      }
    },
    onGithubSignIn: ({ firebase }) => async e => {
      const provider = new firebase.auth.GithubAuthProvider();
      try {
        await firebase.auth().signInWithPopup(provider);

        Router.push("/platforms");
      } catch (e) {
        switch (e.code) {
          default:
            return void console.error(e);
        }
      }
    },
    onPasswordReset: ({ firebase, email, setEmailError, enqueueSnackbar }) => async e => {
      e.preventDefault();

      try {
        await firebase.auth().sendPasswordResetEmail(email);

        enqueueSnackbar(`An email with password reset instructions was sent to ${email}`, {
          variant: "info",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center"
          }
        });
      } catch (e) {
        switch (e.code) {
          case "auth/invalid-email":
            return void setEmailError("The email is invalid");
          case "auth/user-not-found":
            return void setEmailError("User cannot be found");
          default:
            return void console.error(e);
        }
      }
    }
  }),
  lifecycle({
    componentWillReceiveProps({ auth }) {
      if (isLoaded(auth) && !isEmpty(auth)) {
        Router.push("/platforms");
      }
    },
    componentDidMount() {
      const { emailRef, passwordRef, setEmail, setPassword } = this.props;

      setEmail(emailRef.current.value);
      setPassword(passwordRef.current.value);
    }
  })
)(LoginPage);
