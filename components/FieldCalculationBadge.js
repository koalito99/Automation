import _ from "lodash";
import cn from "classnames";
import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Badge from "@material-ui/core/Badge";
import { Fade, makeStyles, withStyles } from "@material-ui/core";
import FieldCalculationTooltip from "./FieldCalculationTooltip";

const useStyles = makeStyles({
  badge: {
    width: "100%",
    position: "absolute"
  },
  "@keyframes pulse": {
    "0%": {
      boxShadow: "0 0 0 0 rgba(119, 73, 255, 0.4)"
    },
    "70%": {
      boxShadow: "0 0 0 6px rgba(119, 73, 255, 0)"
    },
    "100%": {
      boxShadow: "0 0 0 0 rgba(119, 73, 255, 0)"
    }
  },
  pulse: {
    "& > span": {
      animation: "1s $pulse",
      animationIterationCount: "infinite"
    }
  },
  warning: {
    "& > span": {
      backgroundColor: "#ffc400"
    }
  }
});

const StyledBadge = withStyles({
  badge: {
    top: 7,
    right: 7
  }
})(Badge);

function FieldCalculationBadge(props) {
  const classes = useStyles();
  const { calculation, value, typeId, entityId, recordId, fieldId } = props;

  let badgeColor, warning;

  const { loading } = calculation || {};
  
  if (calculation) {
    switch (true) {
      case !!calculation.loading:
        badgeColor = "primary";
        break;
      case !!calculation.error:
      case _.isNaN(calculation.value):
        badgeColor = "secondary";
        break;
      case !!value && !_.isEqual(calculation.value, value):
        badgeColor = "default";
        warning = true;
        break;
    }
  }
  
  const component = useCallback(props => (
    <FieldCalculationTooltip {...{ calculation, value, typeId, entityId, recordId, fieldId }}>
      <span {...props} />
    </FieldCalculationTooltip>
  ), [calculation, value, typeId, badgeColor]);

  return (
    <Fade 
      in={!!badgeColor} 
      style={{
        transitionDelay: loading ? '800ms' : '0ms',
      }} 
    >
      <StyledBadge
        variant="dot"
        invisible={!badgeColor}
        color={badgeColor}
        className={cn(classes.badge, {
          [classes.warning]: warning,
          [classes.pulse]: loading
        })}
        component={component}
      >
        <br />
      </StyledBadge>
    </Fade>
  );
}

FieldCalculationBadge.propTypes = {};

export default FieldCalculationBadge;
