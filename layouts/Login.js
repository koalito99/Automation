import React from "react";
import PropTypes from "prop-types";
import color from "tinycolor2";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = theme => {
  return {
    container: {
      minHeight: "100vh"
    },
    left: {
      padding: theme.spacing(5)
    },
    right: {
      background: `url("${require("../assets/platform-login.jpg")}") no-repeat center center`,
      backgroundSize: "cover",
      padding: theme.spacing(5)
    },
    action: {
      marginTop: theme.spacing(2)
    },
    panel: {
      maxWidth: "80%"
    }
  };
};

class LoginLayout extends React.Component {
  onGetStartedClick() {
    window.location.assign("https://blondieapps.typeform.com/to/scV2g5");
  }

  render() {
    const { classes, children } = this.props;

    return (
      <Grid container className={classes.container}>
        <Grid item xs container alignItems="center" justify="center" className={classes.left}>
          {children}
        </Grid>
        <Hidden smDown>
          <Grid item xs container alignItems="center" justify="center" className={classes.right}>
            <Grid item className={classes.panel}>
              <Typography variant="h6" gutterBottom>
                Early Bird Program
              </Typography>
              <Typography variant="h4" gutterBottom>
                Join Blondie Platform today and get access to early bird updates.
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                className={classes.action}
                onClick={this.onGetStartedClick}
              >
                Join Now
              </Button>
            </Grid>
          </Grid>
        </Hidden>
      </Grid>
    );
  }
}

LoginLayout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginLayout);
