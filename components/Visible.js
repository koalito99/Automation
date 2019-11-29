import React from "react";
import PropTypes from "prop-types";

const Visible = ({ on, children }) => {
  if (!on) {
    return null;
  }
  return children;
};

Visible.propTypes = {
  on: PropTypes.bool,
  children: PropTypes.node.isRequired
};

Visible.defaultProps = {
  on: true
};

export default Visible;
