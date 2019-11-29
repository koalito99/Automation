import React from "react";
import cn from "classnames";
import moment from "moment";
import withStyles from "@material-ui/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import FIELD_TYPES from "../constants/fieldTypes";
import { Link as RouterLink } from "../routes";

const styles = theme => ({
  badge: {
    width: "100%"
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
  },
  card: {
    minWidth: 275
  },
  title: {
    fontSize: 10
  }
});

const StyledBadge = withStyles(theme => ({
  badge: {
    top: 7,
    right: 7
  }
}))(Badge);

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    background: "none",
    padding: 0,
    boxShadow: "none"
  }
}))(Tooltip);

function Calculatable({
  platformId,
  type,
  calculation = {},
  value,
  onChangeHandler,
  children,
  classes
}) {
  let badgeColor, tooltipContent;

  const { id, autoIncrement, autoGenerate, autoCalculate } = type || {};
  const autoCalculated = autoIncrement || autoGenerate || autoCalculate;

  if (!autoCalculated) return children;

  switch (true) {
    case !!calculation.loading:
      badgeColor = "primary";
      break;
    case !!calculation.error:
      badgeColor = "secondary";
      tooltipContent = (
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Error message
            </Typography>
            <Typography variant="body2">{calculation && calculation.error.message}</Typography>
          </CardContent>
          <CardActions>
            <RouterLink route="type" params={{ platformId, id }}>
              <Button size="small" color="secondary">
                Fix it
              </Button>
            </RouterLink>
          </CardActions>
        </Card>
      );
      break;
    case _.isNaN(calculation.value):
      badgeColor = "secondary";
      tooltipContent = (
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Value is not a number
            </Typography>
            <Typography variant="body2">
              You might have a issue in your formula, e.g. division by zero.
            </Typography>
          </CardContent>
          <CardActions>
            <RouterLink route="type" params={{ platformId, id }}>
              <Button size="small" color="secondary">
                Fix it
              </Button>
            </RouterLink>
          </CardActions>
        </Card>
      );
      break;
    case !_.isEqual(calculation.value || "", value || ""):
      badgeColor = "warning";

      let actualValue = calculation.value;

      switch (type.type) {
        case FIELD_TYPES.DATE:
          actualValue = moment(actualValue).format("DD.MM.YYYY");
          break;

        case FIELD_TYPES.TIME:
          actualValue = moment(actualValue).format("HH:mm");
          break;

        case FIELD_TYPES.DATE_TIME:
          actualValue = moment(actualValue).format("DD.MM.YYYY HH:mm");
          break;

        case FIELD_TYPES.BOOLEAN:
          actualValue = actualValue ? "Yes" : "No";
          break;

        // case FIELD_TYPES.ENTITY:
        //   actualValue = actualValue && (
        //     <RouterLink route="resource" params={{ platformId, entityId, id: actualValue }}>
        //       <Link>
        //         <EntityTitle {...{ entityId, value: actualValue, orderedTitleFields }} />
        //       </Link>
        //     </RouterLink>
        //   );
        //   break;
      }

      tooltipContent = (
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Outdated value
            </Typography>
            <Typography variant="body2" component="p">
              Calculated value is {actualValue || "empty"}
            </Typography>
          </CardContent>
          {onChangeHandler && (
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => onChangeHandler({ target: { value: undefined } })}
              >
                Update
              </Button>
            </CardActions>
          )}
        </Card>
      );
      break;
  }

  const withTooltip = child =>
    tooltipContent ? (
      <StyledTooltip interactive title={tooltipContent} placement="top-end">
        {child}
      </StyledTooltip>
    ) : (
      child
    );

  return (
    <StyledBadge
      variant="dot"
      invisible={!badgeColor}
      color={badgeColor}
      className={cn(classes.badge, {
        [classes.warning]: badgeColor === "warning",
        [classes.pulse]: calculation.loading
      })}
      component={props => withTooltip(<span {...props} />)}
    >
      {children}
    </StyledBadge>
  );
}

export default withStyles(styles)(Calculatable);
