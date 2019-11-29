import _ from "lodash";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles, withStyles } from "@material-ui/core";

import useRouteName from "hooks/useRouteName";
import useRouteParams from "hooks/useRouteParams";
import useFieldValue from "hooks/useFieldValue";
import Router from "../routes";

const useStyles = makeStyles({
  card: {
    minWidth: 275
  },
  title: {
    fontSize: 10
  }
});

const StyledTooltip = withStyles({
  tooltip: {
    background: "none",
    padding: 0,
    boxShadow: "none"
  }
})(Tooltip);

function FieldCalculationTooltip(props) {
  const classes = useStyles();
  const routeName = useRouteName();
  const { platformId } = useRouteParams();
  const { calculation, value, typeId, entityId, recordId, fieldId, children, defaultValue } = props;
  const [fieldValue, setFieldValue] = useFieldValue(entityId, recordId, fieldId, defaultValue);

  if (!calculation) return children;

  let title, description, onClick;

  switch (true) {
    case !!calculation.error:
      title = "Error";
      description = calculation && calculation.error.message;
      onClick = () => Router.pushRoute("type", { platformId, id: typeId });
      break;
    case _.isNaN(calculation.value):
      title = "Value is not a number";
      description = "You might have a issue in your formula, e.g. division by zero.";
      onClick = () => Router.pushRoute("type", { platformId, id: typeId });
      break;
    case !!value && !_.isEqual(calculation.value, value):
      title = "Outdated value";
      description = `Calculated value is ${calculation.value || "empty"}`;
      if (routeName !== "resource") {
        onClick = () => setFieldValue();
      }
      break;
    default:
      return children;
  }

  return useMemo(
    () => (
      <StyledTooltip
        interactive
        title={
          <div>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2">{description}</Typography>
              </CardContent>
              { onClick && 
                <CardActions>
                  <Button size="small" color="secondary" onClick={onClick}>
                    Fix it
                  </Button>
                </CardActions>
              }
            </Card>
          </div>
        }
        placement="top-end"
      >
        <div>{children}</div>
      </StyledTooltip>
    ),
    [title, onClick]
  );
}

FieldCalculationTooltip.propTypes = {};

export default FieldCalculationTooltip;
