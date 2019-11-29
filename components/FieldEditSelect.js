import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { TextField, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import clonePropTypes from "helpers/clonePropTypes";
import FieldCalculationBadge from "components/FieldCalculationBadge";
import useFieldEdit from "hooks/useFieldEdit";

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative"
  }
}));

function FieldEditSelect(props) {
  const { options, entityId, recordId, fieldId, defaultValue, ...fieldProps } = props;

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

  const actualOptions = useMemo(() => {
    if (typeof options === "function") {
      return options();
    }

    return options;
  }, [options]);

  return (
    <div className={classes.root}>
      <FieldCalculationBadge {...{ value, calculation, typeId: type.id }} />
      <TextField select {...{ value, error: !!fieldError, onChange }} {...fieldProps}>
        {actualOptions.map(option => {
          const { label, value } = _.isPlainObject(option)
            ? option
            : { label: option, value: option };

          return (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          );
        })}
      </TextField>
    </div>
  );
}

FieldEditSelect.propTypes = {};

FieldEditSelect.defaultProps = {
  fullWidth: true,
  variant: "outlined",
  margin: "none",
  InputLabelProps: { shrink: true },
  options: []
};

export default FieldEditSelect;
