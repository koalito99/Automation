import resource from "constants/resources/user";
import TableView from "components/TableView";

import _ from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";
import { withHandlers, lifecycle, withProps } from "recompose";
import { withFirebase, withFirestore } from "react-redux-firebase";
import { authActions } from "react-redux-firebase/lib/actions";

import { Router } from "../../routes";

import queryMatcher from "helpers/queryMatcher";

import withRouter from "helpers/withRouter";
import withDraft from "helpers/withDraft";
import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";

import connectPlatform from "connectors/platform";

import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from '../../helpers/firebaseConfig';

let userCreationApp;

const mapStateToProps = (state, props) => ({
  items:
    props.platform &&
    _.chain(state.firestore.ordered[resource.name.plural] || [])
      .filter(item => (props.platform.members || []).map(member => member.id).includes(item.id))
      .filter(item => queryMatcher(state.route.query.query)(resource.searchBy(item)))
      .orderBy(item => resource.orderBy({ firestore: state.firestore, ...item }))
      .value()
});

export default compose(
  withRouter,
  withFirebase,
  withFirestore,
  withDraft(),
  connectPlatform,
  connect(
    mapStateToProps,
    dispatch => ({ dispatch })
  ),
  firestoreConnectForKeys("platform", ({ platform }) => {
      const ids = (platform.members || []).map(member => member.id);

      return ids.length ? [{
          collection: resource.name.plural,
          docs: ids
        }]
        : [];
    }
  ),
  withProps({
    resource
  }),
  withHandlers({
    onCancel: ({ platformId, query }) => () => {
      const { route, params } = resource.routes.search({ platformId, query });
      Router.pushRoute(route, params);
    }
  }),
  withHandlers({
    onSearch: ({ platformId }) => query => {
      const { route, params } = resource.routes.search({ platformId, query });
      Router.pushRoute(route, params);
    },
    onAdd: ({ platformId, query }) => () => {
      const { route, params } = resource.routes.new({ platformId, query });
      Router.pushRoute(route, params);
    },
    onSave: ({
      dispatch,
      firestore,
      platform,
      platformId,
      draft: { id, ...attrs },
      setErrors,
      onCancel,
      firebase: defaultApp
    }) => async e => {
      e.preventDefault();

      const errors = resource.schema.reduce((obj, field) => {
        if (field.required && !attrs[field.name]) {
          obj[field.name] = "is required";
        }

        return obj;
      }, {});

      setErrors(errors);

      if (!_.isEmpty(errors)) return;

      try {
        if (!userCreationApp) {
          userCreationApp = firebase.initializeApp(firebaseConfig, "userCreationApp");
        }

        const userData = await userCreationApp
          .auth()
          .createUserWithEmailAndPassword(attrs.email, attrs.password || "");

        authActions.createUserProfile(dispatch, defaultApp, userData, { email: attrs.email });

        let members = [...(platform.members || [])];

        members = members.map(member => member.id).filter(id => id !== userData.user.id);

        members.push(userData.user.uid);

        firestore.update(`platforms/${platformId}`, {
          members: members.map(id => firestore.collection("users").doc(id))
        });

        onCancel();
      } catch (e) {
        switch (e.code) {
          case "auth/weak-password":
            setErrors({ password: e.message });
            return;
          case "auth/email-already-in-use":
            const result = await firestore.get({
              collection: "users",
              where: [["email", "==", attrs.email]]
            });

            const user = result.docs[0];

            if (!user) {
              onCancel();
              return;
            }

            let members = [...(platform.members || [])];

            members = members.map(member => member.id).filter(id => id !== user.id);

            members.push(user.id);

            firestore.update(`platforms/${platformId}`, {
              members: members.map(id => firestore.collection("users").doc(id))
            });

            onCancel();

            return;
        }

        console.error(e);
      }
    },
    onDelete: ({ firestore, platform, platformId, draft: { id }, onCancel }) => () => {
      let members = [...(platform.members || [])];

      members = members.map(member => member.id).filter(memberId => memberId !== id);

      firestore.update(`platforms/${platformId}`, {
        members: members.map(id => firestore.collection("users").doc(id))
      });

      onCancel();
    },
    onDeleteHandler: ({ firestore, platform, platformId, onCancel }) => ({ id }) => () => {
      let members = [...(platform.members || [])];

      members = members.map(member => member.id).filter(memberId => memberId !== id);

      firestore.update(`platforms/${platformId}`, {
        members: members.map(id => firestore.collection("users").doc(id))
      });

      onCancel();
    }
  }),
  lifecycle({
    componentWillReceiveProps({ route, id, items, setDraft }) {
      const prev = this.props;
      const idChanged = id !== prev.id;
      const routeChanged = route !== prev.route;
      const itemsLoaded = items && items.length > 0 && (!prev.items || prev.items.length === 0);

      if (idChanged || routeChanged || itemsLoaded) {
        const item = items && items.find(item => item.id === id);
        setDraft(item || {});
      }
    }
  })
)(TableView);
