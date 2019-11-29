import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { Checkbox, FormControl, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import clonePropTypes from "helpers/clonePropTypes";
import FieldCalculationBadge from "components/FieldCalculationBadge";
import useFieldEdit from "hooks/useFieldEdit";

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative"
  },
  control: {
    height: "100%",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

function FieldEditCheckbox(props) {
  const { entityId, recordId, fieldId, defaultValue, ...fieldProps } = props;
  const classes = useStyles();

  const { value, type, fieldError, calculation, setFieldValue } = useFieldEdit(
    entityId,
    recordId,
    fieldId,
    defaultValue
  );

  const onChange = useCallback(e => setFieldValue(e.target.checked), [setFieldValue]);

  const control = useMemo(() => {
    return <Checkbox {...{ value, onChange }} color="primary" />;
  }, [value, onChange]);

  return (
    <div className={classes.root}>
      <FieldCalculationBadge {...{ value, calculation, typeId: type.id }} />
      <FormControlLabel
        className={classes.control}
        {...{ control, error: !!fieldError }}
        {...fieldProps}
      />
    </div>
  );
}

FieldEditCheckbox.propTypes = {};

FieldEditCheckbox.defaultProps = {
  margin: "none",
  variant: "outlined"
};

export default FieldEditCheckbox;
