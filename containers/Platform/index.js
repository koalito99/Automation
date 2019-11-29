import { connect } from "react-redux";
import { compose } from "redux";

import withRouterParams from "helpers/withRouterParams";
import withConfiguration from "helpers/withConfiguration";
import Platform from "components/Platform";

const mapStateToProps = (state, props) => ({
  platform: props.configuration.platform
});

export default compose(
  withConfiguration,
  withRouterParams("platformId"),
  connect(mapStateToProps)
)(Platform);
