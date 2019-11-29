import { compose, withHandlers, withProps } from "recompose";

import withEntity from "helpers/withEntity";
import withRouterParams from "helpers/withRouterParams";

import ViewSelector from "components/ViewSelector";
import connectEntityViews from "../../connectors/entityViews";

import { Router } from "../../routes";

export default compose(
  withRouterParams("platformId", "entityId", "view"),
  withEntity,
  connectEntityViews,
  withHandlers({
    onChange: ({ platformId, entityId }) => e => {
      const { value: view } = e.target;
      Router.pushRoute("resources", { platformId, entityId, view });
    }
  })
)(ViewSelector);
