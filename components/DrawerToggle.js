import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import useDrawerToggle from "../hooks/useDrawerToggle";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    color: "white"
  }
});

function DrawerToggle() {
  const classes = useStyles();
  const [_, onDrawerToggle] = useDrawerToggle();

  return (
    <IconButton onClick={onDrawerToggle} className={classes.button}>
      <MenuIcon />
    </IconButton>
  );
}

export default DrawerToggle;
