import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

function AutoCalculatedField(props) {
  return (
    <TextField
      {...props}
      value={props.calculatedValue}
      InputLabelProps={{
        shrink: props.calculatedValue !== undefined
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {
              props.loading &&
                <CircularProgress size={18} />
            }
          </InputAdornment>
        )
      }}
    />
  );
}

export default AutoCalculatedField;