import React from "react";
import { Hidden, Typography, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import DrawerToggle from "./DrawerToggle";

const styles = theme => ({
  imgHolder: {
    backgroundImage: `url(${require("../images/illustration.png")})`,
    height: "100%",
    width: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundColor: theme.palette.primary.blue,

    [theme.breakpoints.up("sm")]: {
      margin: -theme.spacing(3),
      marginTop: -theme.spacing(2),
      marginBottom: 0,
      height: `calc(100% - ${-theme.spacing(2)}px) !important`,
      width: `calc(100% - ${-theme.spacing(3)}px * 2)`
    },

    [theme.breakpoints.up("lg")]: {
      margin: -theme.spacing(6),
      marginTop: -theme.spacing(4),
      marginBottom: 0,
      height: `calc(100% - ${-theme.spacing(4)}px) !important`,
      width: `calc(100% - ${-theme.spacing(6)}px * 2)`
    },

    "& header, div": {
      backgroundColor: "transparent"
    }
  },
  main__wrapper: {
    height: 605,
    maxWidth: 936,
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    padding: 40,
    color: "#fff"
  },
  heading: {
    marginBottom: 100,
    "& *": {
      color: "inherit"
    }
  },
  getStarted: {
    maxWidth: 400,

    "& *": {
      color: "inherit"
    }
  }
});

class Platform extends React.Component {
  render() {
    const { platform, classes } = this.props;

    return (
      <div className={classes.imgHolder}>
        <div className={classes.main__wrapper}>
          <div className={classes.heading}>
            <Grid container spacing={2} alignItems="center">
              <Hidden lgUp>
                <Grid item>
                  <DrawerToggle />
                </Grid>
              </Hidden>
              <Grid item xs>
                <Typography variant="h5">{platform.title}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className={classes.getStarted}>
            <Typography variant="h4" gutterBottom>
              Get started by adding Platform to your app
            </Typography>
            <Typography variant="body2">Our core SDK unlocks most Platform features</Typography>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Platform);
