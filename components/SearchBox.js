import React, { useCallback, useMemo } from "react";
import { connectSearchBox } from "react-instantsearch-dom";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const defaultInputLabelProps = { shrink: true, style: { color: "white" } };
const defaultInputProps = { disableUnderline: true, style: { color: "white" } };

function SearchBox(props) {
  const {
    currentRefinement,
    refine,
    setSearchVisible = () => {},
    variant = "filled",
    placeholder = `Lookup by any attribute...`,
    InputLabelProps = defaultInputLabelProps,
    InputProps: inputPropsOverride = defaultInputProps
  } = props;

  const onChange = useCallback(e => {
    refine(e.target.value);
  }, []);

  const onBlur = useCallback(e => {
    if (!e.target.value) {
      setSearchVisible(false);
    }
  }, []);

  const onReset = useCallback(e => {
    refine();
    setSearchVisible(false);
  }, []);

  const InputProps = useMemo(() => {
    return {
      ...inputPropsOverride,
      endAdornment: setSearchVisible && (
        <InputAdornment position="end">
          <IconButton style={{ color: "white" }} onClick={onReset}>
            <CloseIcon />
          </IconButton>
        </InputAdornment>
      )
    };
  }, []);

  return (
    <TextField
      label="Search"
      autoFocus
      fullWidth
      value={currentRefinement}
      {...{ variant, onChange, onBlur, InputLabelProps, InputProps, placeholder }}
    />
  );
}

export default connectSearchBox(SearchBox);
