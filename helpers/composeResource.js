import _ from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";
import { withHandlers, lifecycle, withProps } from "recompose";
import { firestoreConnect, withFirestore } from "react-redux-firebase";

import { Router } from "../routes";

import queryMatcher from "helpers/queryMatcher";
import { STATE_TYPES } from "blondie-platform-common";

import withRouter from "helpers/withRouter";
import withDraft from "helpers/withDraft";

export default (resource, ...fn) => {
  const mapStateToProps = state => ({
    items:
      state.firestore.ordered[resource.name.plural] &&
      _.chain(state.firestore.ordered[resource.name.plural])
        .filter(item => queryMatcher(state.route.query.query)(resource.searchBy(item)))
        .orderBy(item => resource.orderBy({ firestore: state.firestore, ...item }))
        .value(),
    ...resource.stateToProps(state)
  });

  return compose(
    withRouter,
    withFirestore,
    withDraft(),
    connect(mapStateToProps),
    firestoreConnect(({ firestore, platformId }) =>
      !platformId
        ? []
        : [
            {
              collection: resource.name.plural,
              where: [
                ["state", "==", STATE_TYPES.ACTIVE],
                ["platform", "==", firestore.collection("platforms").doc(platformId)]
              ]
            }
          ]
    ),
    withProps({
      resource
    }),
    withHandlers({
      onCancel: ({ platformId, query, setErrors }) => (e, onSuccess) => {
        const { route, params } = resource.routes.search({ platformId, query });
        Router.pushRoute(route, params);
        setErrors(null);
        if (onSuccess) {
          onSuccess();
        }
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
      onEditHandler: ({ platformId, query }) => ({ id }) => {
        const { route, params } = resource.routes.show({ platformId, id, query });
        Router.pushRoute(route, params);
      },
      onSave: ({ firestore, platformId, draft: { id, ...attrs } = {}, setErrors, onCancel }) => (
        e,
        onSuccess
      ) => {
        e.preventDefault();
        const initialDraft = resource.initialDraft || {};
        const data = { ...initialDraft, ...attrs };

        const errors = resource.schema.reduce((obj, field) => {
          const isRequired = field.required;
          const isVisible = !field.visible || field.visible(data);
          const isEmpty = !data[field.name];
          if (isRequired && isVisible && isEmpty) {
            obj[field.name] = "is required";
          }

          return obj;
        }, {});

        setErrors(errors);

        if (!_.isEmpty(errors)) return;

        if (id) {
          firestore.update(`${resource.name.plural}/${id}`, {
            ...data
          });
        } else {
          firestore.add(resource.name.plural, {
            ...data,
            platform: firestore.collection("platforms").doc(platformId),
            state: STATE_TYPES.ACTIVE
          });
        }

        onCancel();
        if (onSuccess) {
          onSuccess();
        }
      },
      onMassSaveHandler: ({ firestore, draft, onCancel }) => (e, selected) => {
        e.preventDefault();
        const data = { ...draft };

        selected.forEach(id =>
          firestore
            .collection(resource.name.plural)
            .doc(id)
            .update({
              ...data
            })
        );

        onCancel();
      },
      onDelete: ({ firestore, draft: { id }, onCancel }) => (e, onSuccess) => {
        firestore.update(`${resource.name.plural}/${id}`, { state: STATE_TYPES.DELETED });

        onCancel();
        if (onSuccess) {
          onSuccess();
        }
      },
      onDeleteHandler: ({ firestore, onCancel }) => ({ id }) => () => {
        firestore.update(`${resource.name.plural}/${id}`, { state: STATE_TYPES.DELETED });

        onCancel();
      },
      onMassDeleteHandler: ({ firestore, onCancel }) => selected => {
        selected.forEach(id =>
          firestore
            .collection(resource.name.plural)
            .doc(id)
            .update({ state: STATE_TYPES.DELETED })
        );

        onCancel();
      }
    }),
    lifecycle({
      componentWillReceiveProps({ route, id, items, setDraft, draft }) {
        const prev = this.props;
        const idChanged = id !== prev.id;
        const routeChanged = route !== prev.route;
        const itemsLoaded = items && items.length > 0 && (!prev.items || prev.items.length === 0);

        const item = items && items.find(item => item.id === id);

        if (
          idChanged ||
          routeChanged ||
          itemsLoaded ||
          (item && (_.isEmpty(draft) || item.id !== draft.id))
        ) {
          const item = items && items.find(item => item.id === id);
          setDraft(item || {});
        }
      }
    }),
    ...fn
  );
};
