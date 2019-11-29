import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import Navigator from "../containers/Navigator";
import { compose } from "recompose";

import withRouter from "helpers/withRouter";

const styles = theme => ({
  root: {
    display: "flex",
    minHeight: "100vh"
  },
  appContent: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",

    [theme.breakpoints.up("lg")]: {
      width: "calc(100vw - 300px)",
      marginLeft: 300
    }
  },
  header: {
    flex: "0 0 auto"
  },
  mainContent: {
    flex: "1 0 auto",
    height: "100%",
    paddingTop: 0,
    background: theme.palette.primary.main, //"#eaeff1",

    "& > div": {
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },

    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(3),
      paddingTop: theme.spacing(2),
      paddingBottom: 0
    },

    [theme.breakpoints.up("lg")]: {
      padding: theme.spacing(6),
      paddingTop: theme.spacing(4),
      paddingBottom: 0
    }
  }
});

class Paperbase extends React.Component {
  state = {
    mobileOpen: false,
    minHeight: window.innerHeight
  };

  constructor(props) {
    super(props);

    this.onResize = this.onResize.bind(this);
  }

  onResize() {
    this.setState({ minHeight: window.innerHeight });
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entityId !== this.props.entityId || nextProps.route !== this.props.route) {
      this.setState({ mobileOpen: false });
    }
  }

  render() {
    const { title, tabs, classes, children } = this.props;

    return (
      <div className={classes.root} style={{ minHeight: this.state.minHeight }}>
        <Hidden mdDown implementation="css">
          <Navigator variant="permanent" open />
        </Hidden>
        <Hidden lgUp implementation="css">
          <Navigator variant="temporary" />
        </Hidden>
        <div className={classes.appContent}>
          <main className={classes.mainContent}>{children}</main>
        </div>
      </div>
    );
  }
}

Paperbase.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(Paperbase);
