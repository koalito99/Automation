import { compose, getContext } from "recompose";
import PropTypes from "prop-types";
import { Configuration } from "blondie-platform-common";

export default compose(
  getContext({
    configuration: PropTypes.instanceOf(Configuration)
  })
);
