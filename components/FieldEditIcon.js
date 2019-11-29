import React from "react";
import PropTypes from "prop-types";
import clonePropTypes from "helpers/clonePropTypes";
import IconSelector from "../containers/IconSelector";

function FieldEditIcon(props) {
  return <IconSelector {...props} />;
}

FieldEditIcon.propTypes = {
  ...clonePropTypes(IconSelector)
};

FieldEditIcon.defaultProps = {
  fullWidth: true,
  variant: "outlined",
  margin: "none",
  InputLabelProps: { shrink: true }
};

export default FieldEditIcon;
