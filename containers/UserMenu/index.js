import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { withStyles } from "@material-ui/core/styles";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";
import { Router } from "../../routes";

const styles = theme => ({
  root: {
    display: "flex",
    position: "relative",
    zIndex: 9999999
  },
  paper: {
    marginRight: theme.spacing(2)
  },
  popper: {
    right: 0,
    zIndex: 9999999
  }
});

class Menu extends React.Component {
  state = {
    open: false
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleLogoutClick = async () => {
    await this.props.firebase.logout();
    this.handleClose();

    window.location.assign("/login");
  };

  render() {
    const { classes, auth } = this.props;
    const { open } = this.state;

    const userNameShort = auth.displayName && auth.displayName[0];

    return (
      <div className={classes.root}>
        <div>
          <IconButton
            color="inherit"
            className={classes.iconButtonAvatar}
            onClick={this.handleToggle}
          >
            <Avatar className={classes.avatar}>{userNameShort}</Avatar>
          </IconButton>
          {!isEmpty(auth) && (
            <Popper
              open={open}
              transition
              disablePortal
              placement="right"
              className={classes.popper}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  id="menu-list-grow"
                  style={{ transformOrigin: placement === "bottom" ? "left top" : "right bottom" }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={this.handleClose}>
                      <MenuList>
                        <MenuItem onClick={this.handleLogoutClick}>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          )}
        </div>
      </div>
    );
  }
}

Menu.propTypes = {
  classNames: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  connect(({ firebase: { auth } }) => ({ auth }))
)(withStyles(styles)(Menu));
