import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "components/Icon";
import { Router } from "../routes";

const useStyles = makeStyles(theme => ({
  primary: {
    color: theme.palette.primary.main,
    "& *": {
      color: theme.palette.primary.main
    }
  }
}));

function NavigatorSectionItem(props) {
  const { entityId, id, icon, color, route, params } = props;
  
  const classes = useStyles();
  
  const handleClick = useCallback(() => Router.pushRoute(route, params), [route, params]);

  return (
    <ListItem
      button
      onClick={handleClick}
      className={params.entityId === entityId ? classes.primary : undefined}
    >
      <ListItemIcon>
        <Icon name={icon} color={color} />
      </ListItemIcon>
      <ListItemText>{id}</ListItemText>
    </ListItem>
  );
}

NavigatorSectionItem.propTypes = {
  entityId: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  id: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
};

NavigatorSectionItem.defaultProps = {
  entityId: undefined,
  icon: "",
  color: "",
};


export default NavigatorSectionItem;
