import React, { useCallback } from "react";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import useRouteParams from "../hooks/useRouteParams";
import { Router } from "../routes";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    color: "white"
  }
});

function EditButton() {
  const classes = useStyles();
  const { platformId, entityId, id, view, path } = useRouteParams();
  const onEdit = useCallback(() => {
    Router.pushRoute("resourceEdit", { platformId, entityId, id, view, path });
  }, [platformId, entityId, id, view, path]);

  return (
    <IconButton onClick={onEdit} className={classes.button}>
      <EditIcon />
    </IconButton>
  );
}

export default EditButton;
