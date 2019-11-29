import _ from "lodash";
import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from "react-jss/lib/JssProvider";
import { SnackbarProvider } from "notistack";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import enLocale from "date-fns/locale/en-US";
import theme from "../layouts/ThemeBase";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
// import 'firebase/functions' // <- needed if using httpsCallable

import changeRoute from "../actions/routes";
import initializeStore from "../store";
import getPageContext from "../getPageContext";
import firebaseConfig from '../helpers/firebaseConfig';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.storage();
}

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
  enableLogging: true
};

const defaultLocale = {
  ...enLocale,
  options: {
    ...enLocale.options,
    weekStartsOn: 1 // Monday
  }
}

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    ctx.store.dispatch(changeRoute(ctx.asPath));

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  constructor() {
    super();
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    const {
      store,
      router: { events, asPath }
    } = this.props;

    store.dispatch(changeRoute(asPath));

    events.on("routeChangeStart", this.onRouteChangeComplete);
  }

  componentWillUnmount() {
    const {
      router: { events }
    } = this.props;

    events.off("routeChangeStart", this.onRouteChangeComplete);
  }

  onRouteChangeComplete = url => {
    this.props.store.dispatch(changeRoute(url));
  };

  render() {
    const { Component, pageProps, store } = this.props;

    const rrfProps = {
      firebase,
      config: rrfConfig,
      dispatch: store.dispatch,
      createFirestoreInstance
    };

    return (
      <Container>
        <Head>
          <title>Platform — Blondie</title>
        </Head>
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Provider store={store}>
              <ReactReduxFirebaseProvider {...rrfProps}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={defaultLocale}>
                  <SnackbarProvider maxSnack={3}>
                    <Component pageContext={this.pageContext} {...pageProps} />
                  </SnackbarProvider>
                </MuiPickersUtilsProvider>
              </ReactReduxFirebaseProvider>
            </Provider>
          </ThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default withRedux(initializeStore)(MyApp);
