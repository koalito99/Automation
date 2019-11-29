import React from "react";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  root: {
    position: "absolute",
    top: 48 * 2,
    left: 48,
    right: 48,
    bottom: 48
  },
  view: {
    transition: theme.transitions.create(),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    marginLeft: 0,

    "&:hover": {
      opacity: "1 !important"
    },
    "&:hover ~ div": {
      marginLeft: 300
    }
  }
});

const LEFT_TOTAL_WIDTH = 300.0;

function StackedViews(props) {
  const { children, classes } = props;
  const filteredChildren = children.filter(child => !!child);
  const viewsCount = filteredChildren.length;

  return (
    <div className={classes.root}>
      {React.Children.map(filteredChildren, (child, index) => (
        <div
          key={index}
          className={classes.view}
          style={
            index <= viewsCount
              ? {
                  zIndex: index,
                  left: (LEFT_TOTAL_WIDTH / viewsCount) * index,
                  opacity: (1.0 / viewsCount) * (index + 1)
                }
              : {}
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export default withStyles(styles)(StackedViews);
