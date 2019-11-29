import React from "react";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    color: "white"
  }
});

function ActionButton({ action, onActionHandler }) {
  const classes = useStyles();

  return (
    <Button onClick={onActionHandler(action)} className={classes.button}>
      {action.name}
    </Button>
  );
}

export default ActionButton;
