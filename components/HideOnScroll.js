import React from "react";
import PropTypes from "prop-types";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";

function getScrollY(ref) {
  return ref.pageYOffset !== undefined ? ref.pageYOffset : ref.scrollTop;
}

function getTrigger(event, store, options) {
  const { disableHysteresis = false, threshold = 100 } = options;
  const previous = store.current;
  store.current = event ? getScrollY(event.currentTarget) : previous;

  if (!disableHysteresis && previous !== undefined) {
    if (store.current < previous) {
      return false;
    }
  }

  return store.current > threshold;
}

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({ getTrigger });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.node.isRequired
};

export default HideOnScroll;
