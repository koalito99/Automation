import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import MaterialUiIconPicker from "react-material-ui-icon-picker";

function IconSelector(props) {
  const { onChangeHandler, ...inputProps } = props;

  return (
    <TextField
      {...inputProps}
      InputProps={{
        ...inputProps.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <MaterialUiIconPicker label="Pick" onPick={onChangeHandler} />
          </InputAdornment>
        )
      }}
    />
  );
}

export default IconSelector;
