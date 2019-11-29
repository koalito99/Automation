import React, { useCallback } from "react";
import IconButton from "@material-ui/core/IconButton";
import CopyIcon from "@material-ui/icons/FileCopy";
import { makeStyles } from '@material-ui/core';
import useDialog from '../hooks/useDialog';
import CloneDialog from 'components/CloneDialog';

const useStyles = makeStyles({
  button: {
    color: "white"
  }
});

function CloneButton(props) {
  const { recordId, entityId } = props;
  const classes = useStyles();

  const { openDialog, closeDialog } = useDialog(CloneDialog);
  const onClick = useCallback(() => {
    openDialog({ recordId, entityId });
  }, [entityId, recordId]);

  return (
    <IconButton className={classes.button} onClick={onClick}>
      <CopyIcon />
    </IconButton>
  );
}

export default CloneButton;
