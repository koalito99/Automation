import React from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles({
  button: {
    color: "white"
  }
});

function SaveButton(props) {
  const classes = useStyles();
  const { onSave } = props;

  return (
    <IconButton onClick={onSave} className={classes.button}>
      <SaveIcon />
    </IconButton>
  );
}

export default SaveButton;
