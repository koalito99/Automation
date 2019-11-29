import { compose, withProps } from "recompose";
import withConfiguration from "helpers/withConfiguration";
import withRouterParams from "helpers/withRouterParams";

export default compose(
  withConfiguration,
  withRouterParams("entityId"),
  withProps(({ configuration, entityId }) => {
    return {
      entity: configuration.entities.data[entityId]
    };
  })
);
