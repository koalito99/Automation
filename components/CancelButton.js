import React, { useCallback } from "react";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import useRouteParams from "../hooks/useRouteParams";
import { Router } from "../routes";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    color: "white"
  }
});

function CancelButton() {
  const classes = useStyles();
  const { platformId, entityId, id, view, path } = useRouteParams();
  const onCancel = useCallback(() => {
    if (id === "new") {
      Router.pushRoute("resources", { platformId, entityId, view });
    } else {
      Router.pushRoute("resource", { platformId, entityId, id, view, path });
    }
  }, [platformId, entityId, id, view]);

  return (
    <IconButton onClick={onCancel} className={classes.button}>
      <CancelIcon />
    </IconButton>
  );
}

export default CancelButton;
