import React, { useCallback } from "react";
import PropTypes from "prop-types";

import ColorSelector from "../containers/ColorSelector";
import clonePropTypes from "helpers/clonePropTypes";
import useFieldValue from "hooks/useFieldValue";

function FieldEditColor(props) {
  const { entityId, recordId, fieldId, defaultValue, ...fieldProps } = props;
  const [value, setValue] = useFieldValue(entityId, recordId, fieldId, defaultValue);
  const onChange = useCallback(e => setValue(e.target.value), []);

  return <ColorSelector {...{ value, onChange }} {...fieldProps} />;
}

FieldEditColor.propTypes = {
};

FieldEditColor.defaultProps = {
  fullWidth: true,
  variant: "outlined",
  margin: "none",
  InputLabelProps: { shrink: true }
};

export default FieldEditColor;
