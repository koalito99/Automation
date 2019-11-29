import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

function Loading() {
  return (
    <Paper square>
      <Grid container spacing={3} justify="center">
        <Grid item>
          <CircularProgress size={24} />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Loading;
