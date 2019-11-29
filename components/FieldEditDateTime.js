import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import clonePropTypes from "helpers/clonePropTypes";
import FieldCalculationBadge from "components/FieldCalculationBadge";
import useFieldEdit from "hooks/useFieldEdit";
import getDateValue from '../helpers/getDateValue';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  }
}));

function FieldEditDateTime(props) {
  const { entityId, recordId, fieldId, defaultValue, ...fieldProps } = props;
  const classes = useStyles();

  const { value: rawValue, type, fieldError, calculation, setFieldValue } = useFieldEdit(
    entityId,
    recordId,
    fieldId,
    defaultValue
  );

  const value = getDateValue(rawValue);
  const onChange = useCallback(value => setFieldValue(value), [setFieldValue]);

  return (
    <div className={classes.root}>
      <FieldCalculationBadge {...{ value, calculation, typeId: type.id }} />
      <KeyboardDateTimePicker {...{ value, error: !!fieldError, onChange }} {...fieldProps} />
    </div>
  );
}

FieldEditDateTime.propTypes = {
};

FieldEditDateTime.defaultProps = {
  fullWidth: true,
  variant: "outlined",
  margin: "none",
  InputLabelProps: { shrink: true },
  autoOk: true,
  ampm: false,
  variant: "inline",
  inputVariant: "outlined",
  InputAdornmentProps: { position: "end" },
  format: "dd.MM.yyyy HH:mm"
};

export default FieldEditDateTime;
