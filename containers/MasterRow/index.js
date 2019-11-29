import { compose, withHandlers, withState, lifecycle, shouldUpdate } from "recompose";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";

import withRouterParams from "helpers/withRouterParams";
import withTableHandlers from "helpers/withTableHandlers";
import withOrderedEntityTableViewFields from "helpers/withOrderedEntityTableViewFields";
import MasterRow from "components/MasterDetailsView/MasterRow";
import { runCode } from "blondie-platform-common";

const mapStateToProps = (state, props) => ({
  auth: state.firebase.auth
});

export default compose(
  withRouterParams("platformId", "entityId", "id", "view"),
  shouldUpdate((prev, next) => {
    const differentEntities = prev.entityId !== next.entityId;
    const differentView = prev.view !== next.view;
    const wasSelected = prev.entity.objectID === prev.id;
    const nowSelected = next.entity.objectID === next.id;
    const selectionChanged = wasSelected !== nowSelected;

    return differentEntities || differentView || selectionChanged;
  }),
  connect(mapStateToProps),
  withFirestore,
  withOrderedEntityTableViewFields,
  withTableHandlers({
    routes: {
      index: "resources",
      show: "resource",
      new: "resourceNew"
    }
  }),
  withState("allowEdit", "setAllowEdit"),
  withState("allowDelete", "setAllowDelete"),
  withHandlers({
    checkAllowEdit: ({ configuration, auth, entityId, setAllowEdit }) => async () => {
      if (configuration.permissions.filtered.recordEdit.length === 0) {
        setAllowEdit(true);
        return;
      }

      const results = await Promise.all(
        configuration.permissions.filtered.recordEdit.map(async permission => {
          const result = await runCode(permission.rule, { auth, entityId });

          return result;
        })
      );

      if (!_.some(results, r => !r)) {
        setAllowEdit(true);
        return;
      }

      setAllowEdit(false);
    },
    checkAllowDelete: ({ configuration, auth, entityId, setAllowDelete }) => async () => {
      if (configuration.permissions.filtered.recordDelete.length === 0) {
        setAllowDelete(true);
        return;
      }

      const results = await Promise.all(
        configuration.permissions.filtered.recordDelete.map(async permission => {
          const result = await runCode(permission.rule, { auth, entityId });

          return result;
        })
      );

      if (!_.some(results, r => !r)) {
        setAllowDelete(true);
        return;
      }

      setAllowDelete(false);
    }
  }),
  lifecycle({
    componentDidMount() {
      this.props.checkAllowEdit();
      this.props.checkAllowDelete();
    },
    componentDidUpdate({ entityId }) {
      if (typeof this.props.allowEdit === "undefined" || this.props.entityId !== entityId) {
        this.props.checkAllowEdit();
      }

      if (typeof this.props.allowDelete === "undefined" || this.props.entityId !== entityId) {
        this.props.checkAllowDelete();
      }
    }
  })
)(MasterRow);
