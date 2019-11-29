import TextField from "@material-ui/core/TextField";
import React from 'react';
import { Grid } from '@material-ui/core';

export default function OptionField({ value, label, onChange, onBlur, fieldOptions }) {
  return (
    <Grid item xs="6" sm="6" md="3">
      <TextField
        value={value}
        label={label}
        onChange={onChange}
        onBlur={onBlur}
        {...fieldOptions}
      />
    </Grid>
  );
}
