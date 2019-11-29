import React, { useCallback } from 'react';
import { Grid } from '@material-ui/core';
import OptionField from './OptionField';

const fieldOptions = {
  variant: "outlined",
  InputLabelProps: { shrink: true },
  fullWidth: true
};

export default function FieldEditOption({ index, option, isKeyValue, onChange, onBlur }) {
  const labelOnChangeHandler = useCallback((e) => {
    onChange(index, e.target.value, option.value)
  }, [index, option, isKeyValue, onChange]);
  const valueOnChangeHandler = useCallback((e) => {
    onChange(index, option.key, e.target.value)
  }, [index, option, isKeyValue, onChange]);
  const singleLabelOnChangeHandler = useCallback((e) => {
    onChange(index, e.target.value)
  }, [index, option, isKeyValue, onChange]);
  const onBlurHandler = useCallback(() => {
    onBlur(index);
  }, [index, option]);

  return (
    <>
      {
        isKeyValue ? (
            <Grid container spacing="1">
              <OptionField
                value={option.key}
                label="Label"
                fieldOptions={fieldOptions}
                onChange={labelOnChangeHandler}
                onBlur={onBlurHandler}
              />
              <OptionField
                value={option.value}
                label="Value"
                fieldOptions={fieldOptions}
                onChange={valueOnChangeHandler}
                onBlur={onBlurHandler}
              />
            </Grid>
          )
          :
          <Grid container spacing="1">
            <OptionField
              value={option}
              label="Label"
              fieldOptions={fieldOptions}
              onChange={singleLabelOnChangeHandler}
              onBlur={onBlurHandler}
            />
          </Grid>
      }
    </>
  );
}
