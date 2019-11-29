import { compose } from "redux";

import withConfiguration from "helpers/withConfiguration";
import withRouterParams from "helpers/withRouterParams";
import RelatedWidgets from "components/RelatedWidgets";

export default compose(
  withRouterParams("entityId", "id"),
  withConfiguration
)(RelatedWidgets);
