import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import theme from "./ThemeBase";

const styles = () => ({
  root: {
    display: "flex",
    minHeight: "100vh"
  },
  welcome: {
    maxWidth: 936,
    width: "100%",
    margin: "100px auto 260px auto",
    "& > *": {
      maxWidth: "50%"
    },
    "& p": {
      marginBottom: theme.spacing(1)
    },
    "& a": {
      color: theme.palette.primary.main,
      marginRight: theme.spacing(1)
    }
  },
  appContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    "& header": {
      backgroundColor: "transparent !important"
    }
  },
  mainContent: {
    flex: 1,
    padding: "48px 36px 0",
    background: "#eaeff1",
    position: "relative",
    minHeight: "300px"
  },
  inner: {
    marginTop: "-190px"
  }
});

class Paperbase extends React.Component {
  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.appContent}>
          <div className={classes.welcome}>
            <Typography variant="h4" gutterBottom>
              Welcome to Platform!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Tool from Blondie for developing powerful apps, automating them and releasing them
              into the wild.
            </Typography>
            <Typography variant="body2">
              <a href="">Learn more</a> <a href="">Documentation</a> <a href="">Support</a>
            </Typography>
          </div>
          <main className={classes.mainContent}>
            <div className={classes.inner}>{children}</div>
          </main>
        </div>
      </div>
    );
  }
}

Paperbase.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Paperbase);
