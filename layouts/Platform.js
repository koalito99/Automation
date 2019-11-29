import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import Navigator from "containers/Navigator";
import withRouter from "helpers/withRouter";

import theme from "./ThemeBase";

import Platform from "containers/Platform";
import { compose } from "recompose";
import { connect } from "react-redux";

const drawerWidth = 256;

const styles = () => ({
  root: {
    display: "flex",
    minHeight: "100vh"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    "& header": {
      backgroundColor: "transparent"
    }
  },
  imgHolder: {
    backgroundImage: `url(${require("../images/illustration.png")})`,
    width: "100%",
    height: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 100%",
    backgroundColor: theme.palette.primary.blue,

    "& header, div": {
      backgroundColor: "transparent"
    }
  },
  mainContent: {
    flex: 1,
    background: "#eaeff1"
  }
});

class PaperBase extends React.Component {
  render() {
    const { title, tabs, classes, children, query } = this.props;

    return (
      <div className={classes.root}>
        <nav className={classes.drawer}>
          <Hidden smUp implementation="js">
            <Navigator PaperProps={{ style: { width: drawerWidth } }} variant="temporary" />
          </Hidden>
          <Hidden xsDown implementation="css">
            <Navigator PaperProps={{ style: { width: drawerWidth } }} />
          </Hidden>
        </nav>
        <div className={classes.appContent}>
          <div className={classes.imgHolder}>
            <Platform {...this.props} />
          </div>
          <main className={classes.mainContent}>{children}</main>
        </div>
      </div>
    );
  }
}

PaperBase.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(PaperBase);
