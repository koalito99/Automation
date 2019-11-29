import { compose, withHandlers, withState, lifecycle } from "recompose";
import { connect } from "react-redux";

import AddButton from "components/MasterDetailsView/AddButton";
import withRouterParams from "helpers/withRouterParams";
import withConfiguration from "helpers/withConfiguration";
import { Router } from "../../routes";
import { runCode } from "blondie-platform-common";

function mapStateToProps(state) {
  return {
    auth: state.firebase.auth
  };
}

export default compose(
  withRouterParams("platformId", "entityId", "view"),
  connect(mapStateToProps),
  withConfiguration,
  withHandlers({
    onAdd: ({ platformId, entityId, view }) => () => {
      Router.pushRoute("resource", { platformId, entityId, id: "new", view });
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
)(AddButton);
