import _ from "lodash";
import { connect } from "react-redux";
import { compose } from "redux";
import { withHandlers, withState, lifecycle, withProps } from "recompose";
import { firestoreConnect, withFirestore } from "react-redux-firebase";
import TableView from "components/TableView";

import { Router } from "../../routes";

import queryMatcher from "helpers/queryMatcher";
import { STATE_TYPES } from "blondie-platform-common";

import SOURCES from "constants/sources";

import withDraft from "helpers/withDraft";
import withRouter from "helpers/withRouter";
import buildResource from "../../helpers/buildResource";
import SourceImportDialog from "../../containers/SourceImportDialog";
import withConfiguration from '../../helpers/withConfiguration';

const mapStateToProps = state => ({
  entityId: state.route.query.type,
  items:
    state.firestore.ordered.sources &&
    _.chain(state.firestore.ordered.sources)
      .filter(item => item.type === state.route.query.type)
      .filter(item => queryMatcher(state.route.query.query)((item => item.name)(item)))
      .orderBy(item => _.get(item, "name", "").toLowerCase())
      .value()
});

export default compose(
  withRouter,
  withFirestore,
  connect(mapStateToProps),
  withConfiguration,
  withDraft(({ items, id }) => {
    const { platform, ...item } = (items && items.find(item => item.id === id)) || {};

    return item;
  }),
  withState("errors", "setErrors", {}),
  withState("indexing", "setIndexing", false),
  firestoreConnect(({ firestore, platformId }) =>
    !platformId
      ? []
      : [
          {
            collection: "sources",
            where: [
              ["state", "==", STATE_TYPES.ACTIVE],
              ["platform", "==", firestore.collection("platforms").doc(platformId)]
            ]
          }
        ]
  ),
  withProps(({ type }) => {
    return {
      resource: buildResource("Source", {
        ...SOURCES.find(source => source.type === type)
      })
    };
  }),
  withHandlers({
    onCancel: ({ platformId, query, resource, type }) => () => {
      const { route, params } = resource.routes.search({
        platformId,
        query,
        type
      });
      Router.pushRoute(route, params);
    }
  }),
  withHandlers({
    onSearch: ({ platformId, resource, type }) => query => {
      const { route, params } = resource.routes.search({
        platformId,
        query,
        type
      });
      Router.pushRoute(route, params);
    },
    onAdd: ({ platformId, query, type, resource }) => () => {
      const { route, params } = resource.routes.new({
        platformId,
        query,
        type
      });
      Router.pushRoute(route, params);
    },
    onEditHandler: ({ platformId, query, resource, type }) => ({ id }) => () => {
      const { route, params } = resource.routes.show({
        platformId,
        id,
        query,
        type
      });
      Router.pushRoute(route, params);
    },
    onSave: ({
      firestore,
      draft: { id, ...attrs },
      resource,
      setErrors,
      onCancel,
      setIndexing,
      type,
      platformId
    }) => e => {
      e.preventDefault();

      const errors = resource.schema.reduce((obj, field) => {
        if (field.required && !attrs[field.name]) {
          obj[field.name] = "is required";
        }

        return obj;
      }, {});

      setErrors(errors);

      if (!_.isEmpty(errors)) return;

      if (id) {
        firestore.update(`${resource.name.plural}/${id}`, {
          ...attrs
        });
      } else {
        firestore.add(resource.name.plural, {
          ...attrs,
          platform: firestore.collection("platforms").doc(platformId),
          state: STATE_TYPES.ACTIVE,
          type
        });
      }

      setIndexing(true);
      onCancel();
    },
    onDelete: ({ firestore, draft: { id }, resource, onCancel }) => () => {
      firestore.update(`${resource.name.plural}/${id}`, {
        state: STATE_TYPES.DELETED
      });

      onCancel();
    },
    onDeleteHandler: ({ firestore, onCancel, resource }) => ({ id }) => () => {
      firestore.update(`${resource.name.plural}/${id}`, {
        state: STATE_TYPES.DELETED
      });

      onCancel();
    },
    onEditMappingsHandler: ({ platformId }) => item => () => {
      Router.pushRoute("mapping", {
        platformId,
        type: item.type,
        sourceId: item.id
      });
    },
    onImportHandler: ({ platformId }) => item => e => {
      Router.pushRoute("sourceImport", {
        platformId,
        type: item.type,
        id: item.id
      });
    }
  }),
  lifecycle({
    componentWillReceiveProps({ route, id, items, setDraft }) {
      const prev = this.props;
      const idChanged = id !== prev.id;
      const routeChanged = route !== prev.route;
      const itemsLoaded = items && items.length > 0 && (!prev.items || prev.items.length === 0);

      if (idChanged || routeChanged || itemsLoaded) {
        const { platform, ...item } = (items && items.find(item => item.id === id)) || {};
        setDraft(item);
      }
    }
  }),
  withProps(({ onEditMappingsHandler, onImportHandler, resource: { importable } }) => {
    const menuItems = {
      "Edit mappings": onEditMappingsHandler
    };

    if (importable) {
      menuItems["Import"] = onImportHandler;
    }

    return {
      menuItems
    };
  }),
  withProps(({ platformId, route, resource, id, items }) => {
    return {
      extra: () => {
        return (
          route.match(/Import$/) && (
            <SourceImportDialog
              {...{
                isOpened: true
              }}
              platformId={platformId}
              source={items && items.find(item => item.id === id)}
              sourceDefinition={resource}
            />
          )
        );
      }
    };
  })
)(TableView);
