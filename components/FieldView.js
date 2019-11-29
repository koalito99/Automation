import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import clonePropTypes from "helpers/clonePropTypes";
import useConfiguration from "hooks/useConfiguration";
import useField from "hooks/useField";
import useFieldValue from "hooks/useFieldValue";
import useFieldCalculation from "hooks/useFieldCalculation";
import FieldViewInput from "./FieldViewInput";
import FieldCalculationBadge from "./FieldCalculationBadge";
import FieldAdornment from "./FieldAdornment";
import FieldActions from "./FieldActions";
import FieldViewOptions from './FieldViewOptions';
import FIELD_TYPES from '../constants/fieldTypes';
import useDraft from '../hooks/useDraft';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  }
}));

function FieldView(props) {
  const {
    entityId,
    recordId,
    fieldId,
    autoFocus,
    fullWidth = true,
    readOnly = true,
    margin = "none",
    variant,
    InputLabelProps = { shrink: true },
    InputProps,
    defaultValue,
    ...fieldProps
  } = props;
  const classes = useStyles();

  const configuration = useConfiguration();
  const field = useField(configuration, fieldId);
  const { prefix, suffix, name: label, relation } = field;

  let { type } = field;
  type = type || {};

  const draft = useDraft(entityId, recordId);
  const [value, setValue] = useFieldValue(entityId, recordId, fieldId, defaultValue);
  const calculation = useFieldCalculation(entityId, recordId, fieldId);
  const onChange = useCallback(e => setValue(e.target.value), [setValue]);
  const inputComponent = useMemo(
    () => props => <FieldViewInput {...{ relation }} {...props} />,
    [relation]
  );

  const startAdornment = useMemo(
    () => <FieldAdornment position="start">{prefix}</FieldAdornment>,
    [prefix]
  );

  const val = useMemo(() => {
    return _.get(calculation, "value", value);
  }, [calculation, value]);

  const endAdornment = useMemo(
    () => (
      <FieldAdornment position="end">
        {suffix} <FieldActions value={val} actions={field.actions.ordered} record={draft} {...{ recordId, entityId }} />
      </FieldAdornment>
    ),
    [val, field]
  );

  return (
    <div className={classes.root}>
      <FieldCalculationBadge {...{ value, calculation, typeId: type.id }} />
      {
        type.type === FIELD_TYPES.OPTIONS
          ? <FieldViewOptions
            label={label}
            value={value}
          />
          : <TextField
            {...{
              label,
              autoFocus,
              fullWidth,
              margin,
              readOnly,
              type: type.type,
              relation,
              value: val,
              variant,
              InputLabelProps,
              InputProps: {
                inputComponent,
                ...InputProps,
                startAdornment,
                endAdornment
              },
              onChange
            }}
            {...fieldProps}
          />
      }
    </div>
  );
}

FieldView.propTypes = {
  entityId: PropTypes.string.isRequired,
  recordId: PropTypes.string.isRequired,
  fieldId: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,

  ...clonePropTypes(TextField, [
    "autoFocus",
    "fullWidth",
    "margin",
    "InputLabelProps",
    "InputProps"
  ])
};

export default FieldView;
