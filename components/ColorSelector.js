import React from "react";
import Avatar from "@material-ui/core/Avatar";
import InputAdornment from "@material-ui/core/InputAdornment";
import ColorPicker from "material-ui-color-picker";

function ColorSelector(props) {
  const { value, onChangeHandler, ...inputProps } = props;
  return (
    <ColorPicker
      value={value}
      TextFieldProps={{
        ...inputProps,
        InputProps: {
          startAdornment: (
            <InputAdornment position="start">
              <Avatar style={{ width: 20, height: 20, backgroundColor: value }} />
            </InputAdornment>
          )
        }
      }}
      onChange={onChangeHandler}
    />
  );
}

export default ColorSelector;
