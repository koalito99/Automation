import { compose, withHandlers, withState, lifecycle } from "recompose";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";

import MasterToolbar from "components/MasterDetailsView/MasterToolbar";
import withRouterParams from "helpers/withRouterParams";
import withConfiguration from "helpers/withConfiguration";
import withRecordsSelection from "helpers/withRecordsSelection";
import { Router } from "../../routes";
import { runCode } from "blondie-platform-common";

import { STATE_TYPES } from "blondie-platform-common";

function mapStateToProps(state) {
  return {
    auth: state.firebase.auth
  };
}

export default compose(
  withRouterParams("platformId", "entityId", "view"),
  connect(mapStateToProps),
  withConfiguration,
  withFirestore,
  withRecordsSelection,
  withHandlers({
    onAdd: ({ platformId, entityId, view }) => () => {
      Router.pushRoute("resource", { platformId, entityId, id: "new", view });
    },
    onCancel: ({ platformId, entityId, view }) => () => {
      Router.pushRoute("resources", { platformId, entityId, view });
    }
  }),
  withHandlers({
    onDeleteSelected: ({ firestore, onCancel, setIndexing }) => selected => {
      firestore.runTransaction(transaction =>
        Promise.all(
          selected.map(id =>
            transaction.update(firestore.doc(`records/${id}`), { state: STATE_TYPES.DELETED })
          )
        )
      );
      setIndexing(true);
      onCancel();
    },
    onRestoreSelected: ({ firestore, onCancel, setIndexing }) => selected => {
      firestore.runTransaction(transaction =>
        Promise.all(
          selected.map(id =>
            transaction.update(firestore.doc(`records/${id}`), { state: STATE_TYPES.ACTIVE })
          )
        )
      );
      setIndexing(true);
      onCancel();
    }
  }),
  withState("allowCreate", "setAllowCreate"),
  withHandlers({
    checkAllowCreate: ({ configuration, auth, entityId, setAllowCreate }) => async () => {
      if (configuration.permissions.filtered.recordCreate.length === 0) {
        setAllowCreate(true);
        return;
      }

      const results = await Promise.all(
        configuration.permissions.filtered.recordCreate.map(async permission => {
          const result = await runCode(permission.rule, { auth, entityId });

          return result;
        })
      );

      if (!_.some(results, r => !r)) {
        setAllowCreate(true);
        return;
      }

      setAllowCreate(false);
    }
  }),
  lifecycle({
    componentDidMount() {
      this.props.checkAllowCreate();
    },
    componentDidUpdate({ entityId }) {
      if (typeof this.props.allowCreate === "undefined" || this.props.entityId !== entityId) {
        this.props.checkAllowCreate();
      }
    }
  })
)(MasterToolbar);
