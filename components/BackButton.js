import React, { useCallback } from "react";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import useRouteParams from "../hooks/useRouteParams";
import { Router } from "../routes";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    color: "white"
  }
});

function BackButton() {
  const classes = useStyles();
  const onBack = useCallback(() => {
    Router.back()
  }, []);

  return (
    <IconButton onClick={onBack} className={classes.button}>
      <ArrowBackIcon />
    </IconButton>
  );
}

export default BackButton;
