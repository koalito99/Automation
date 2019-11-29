import useOptionsField from '../hooks/useOptionsField';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React, { useCallback, useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import FieldEditOption from './FieldEditOption';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  gridContainer: {
    margin: '4px 0'
  }
});

function FieldEditOptions(props) {
  const {
    options,
    entityId,
    recordId,
    fieldId,
    ...fieldProps
  } = props;

  const classes = useStyles(props);

  const { values, isKeyValue, onIsKeyValueChange, onChange, onBlur } = useOptionsField(entityId, recordId, fieldId);
  const onSwitchChangeHandler = useCallback((e) => {
    onIsKeyValueChange(e.target.checked);
  }, [values, onIsKeyValueChange]);
  const switchComponent = useMemo(() => {
    return <Switch
      checked={isKeyValue}
      onChange={onSwitchChangeHandler}
    />;
  }, [isKeyValue, onIsKeyValueChange]);

  return (
    <>
      <Typography variant="subtitle1">
        {fieldProps.label}
      </Typography>
      <FormControlLabel
        control={switchComponent}
        label="Labels and values"
      />
      {
        values.map((option, index) => (
          <div className={classes.gridContainer}>
            <FieldEditOption {...{ index, option, isKeyValue, onChange, onBlur }} />
          </div>
        ))
      }
    </>
  );
}

export default FieldEditOptions;
