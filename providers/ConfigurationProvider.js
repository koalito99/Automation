import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  compose,
  withState,
  withContext,
  lifecycle,
  onlyUpdateForKeys,
  branch,
  renderComponent,
} from "recompose";
import { connect } from "react-redux";
import { withFirestore, withFirebase } from "react-redux-firebase";
import PropTypes from "prop-types";
import withRouterParams from "helpers/withRouterParams";
import { Configuration } from "blondie-platform-common";
import LoadingAuth from "components/LoadingAuth";
import LoadingConfiguration from "components/LoadingConfiguration";
import ConfigurationContext from "contexts/configuration";
import useFirestore from '../hooks/useFirestore';
import { useSnackbar } from 'notistack';
import { Button } from '@material-ui/core';

const configuration = new Configuration({
  only: [
    "platform",
    "views",
    "actions",
    "entities",
    "fields",
    "permissions",
    "relations",
    "types",
    "validators",
    "widgets",
    "sources"
  ]
});

let unsubscribe;
let platform;

function ConfigurationProvider(props) {
  const { platformId } = props;
  const firestore = useFirestore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (platformId && !unsubscribe) {
      unsubscribe = firestore
        .collection("platforms")
        .doc(platformId)
        .onSnapshot((snap) => {
          const data = snap.data();

          if (platform && platform.systemEntitiesUpdatedAtChecksum !== data.systemEntitiesUpdatedAtChecksum) {
            const action = (key) => (
              <Fragment>
                <Button onClick={() => {
                  window.location = window.location;
                }}>
                  Refresh
                </Button>
                <Button onClick={() => {
                  closeSnackbar(key);
                }}>
                  Dismiss
                </Button>
              </Fragment>
            );

            enqueueSnackbar(
              "Platform configuration has been updated. To safely continue your job please refresh platform.",
              {
                variant: "info",
                persist: true,
                preventDuplicate: true,
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "center"
                },
                action
              }
            );
          }

          platform = data;
        });
    }

    if (!platformId && unsubscribe) {
      unsubscribe();
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [platformId]);

  return (
    <ConfigurationContext.Provider value={configuration}>
      {React.Children.only(props.children)}
    </ConfigurationContext.Provider>
  );
}

const contextTypes = {
  configuration: PropTypes.instanceOf(Configuration)
};

function getChildContext(props) {
  configuration.set(props);

  return {
    configuration
  };
}

export default compose(
  withFirebase,
  withFirestore,
  withRouterParams("route", "platformId", "entityId"),
  withState("isLoaded", "setLoaded"),
  connect(state => ({ auth: state.firebase.auth })),
  lifecycle({
    componentDidMount() {
      const {
        route,
        firebase,
        platformId,
        firestore,
        auth,
        isLoaded
      } = this.props;

      configuration.on("change", () => {
        if (!isLoaded && configuration.isLoaded) {
          this.props.setLoaded(configuration.isLoaded);
        }
      });

      configuration.set({ platformId, firestore, auth });

      this.props.setLoaded(configuration.isLoaded);

      firebase.auth().onAuthStateChanged(function (user) {
        if (route !== "login" && !user) {
          window.location.assign("/login");
        }
      });
    },
    componentDidUpdate({ platformId: prevPlatformId, auth: prevAuth }) {
      const { route, platformId, firestore, auth } = this.props;
      if (
        route !== "login" &&
        !prevAuth.isLoaded &&
        auth.isLoaded &&
        auth.isEmpty
      ) {
        window.location.assign("/login");
      } else if (prevPlatformId !== platformId) {
        configuration.set({ platformId, firestore, auth });
      }
    }
  }),
  branch(props => {
    return (
      props.route !== "login" && (!props.auth.isLoaded || props.auth.isEmpty)
    );
  }, renderComponent(LoadingAuth)),
  branch(props => {
    return props.route !== "login" && (props.platformId && !props.isLoaded);
  }, renderComponent(LoadingConfiguration)),
  withContext(contextTypes, getChildContext)
)(ConfigurationProvider);
