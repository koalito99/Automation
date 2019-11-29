import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { CircularProgress } from "@material-ui/core";

const styles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1101
  },
  image: {
    maxHeight: "50vh",
    height: "100%",
    marginBottom: theme.spacing(2)
  },
  content: {
    textAlign: "center"
  },
  progress: {
    marginTop: theme.spacing(2)
  }
});

function EmptyState({ image, title, description, position, loading, ImageProps, classes }) {
  return (
    <div className={classes.container} style={{ position }}>
      <img src={image} className={classes.image} {...ImageProps} />
      <div className={classes.content}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
        {loading && <CircularProgress className={classes.progress} />}
      </div>
    </div>
  );
}

export default withStyles(styles)(EmptyState);
