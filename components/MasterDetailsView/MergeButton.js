import React, { useCallback } from "react";
import { compose } from "recompose";
import { connectHits } from "react-instantsearch-dom";

import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import LayersIcon from "@material-ui/icons/Layers";

const useStyles = makeStyles({
  button: {
    color: "white"
  }
});

function MergeButton({ openDialog, hits }) {
  const classes = useStyles();
  const open = useCallback(() => {
    openDialog({ hits });
  }, [hits]);

  return (
    <IconButton onClick={open} className={classes.button}>
      <LayersIcon />
    </IconButton>
  );
}

export default compose(connectHits)(MergeButton);
