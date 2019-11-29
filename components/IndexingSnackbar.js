import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";

const SNACKBAR_ANCHOR_ORIGIN = {
  vertical: "bottom",
  horizontal: "left"
};

const SNACKBAR_ACTION = <CircularProgress size={20} color="inherit" />;

function IndexingSnackbar(props) {
  const { indexing } = props;

  return (
    <Snackbar
      open={indexing}
      message="Indexing..."
      anchorOrigin={SNACKBAR_ANCHOR_ORIGIN}
      action={SNACKBAR_ACTION}
    />
  );
}

export default IndexingSnackbar;
