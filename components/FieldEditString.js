import React, { useCallback, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import FieldCalculationBadge from "components/FieldCalculationBadge";
import useFieldEdit from "hooks/useFieldEdit";

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative"
  }
}));

function FieldEditString(props) {
  const { entityId, recordId, fieldId, defaultValue, ...fieldProps } = props;
  const classes = useStyles();

  const { value, type, fieldError, calculation, setFieldValue } = useFieldEdit(
    entityId,
    recordId,
    fieldId,
    defaultValue
  );

  const onChange = useCallback(e => {
    setFieldValue(e.target.value);
  }, [setFieldValue]);

  return (
    <div className={classes.root}>
      <FieldCalculationBadge {...{ value, calculation, typeId: type.id }} />
      <TextField {...{ value, error: !!fieldError, onChange }} {...fieldProps} />
    </div>
  );
}

FieldEditString.propTypes = {};

FieldEditString.defaultProps = {
  fullWidth: true,
  variant: "outlined",
  margin: "none",
  InputLabelProps: { shrink: true }
};

export default FieldEditString;
