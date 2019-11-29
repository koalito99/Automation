import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import NavigatorSectionItem from "./NavigatorSectionItem";
import useDrawerToggle from "../hooks/useDrawerToggle";

const useStyles = makeStyles({
  subheader: {
    background: "white"
  },
  list: {
    width: 300
  }
});

function NavigatorSection(props) {
  const { entityId, section, items } = props;
  const classes = useStyles();

  const renderSectionHeader = useCallback(() => {
    if (!section) return;
    return (
      <ListSubheader className={classes.subheader}>{section}</ListSubheader>
    );
  }, [section]);

  return (
    <React.Fragment>
      <Divider light />
      <List dense className={classes.list} subheader={renderSectionHeader()}>
        {items &&
          items.map(({ id: childId, icon, color, route, params }) => (
            <NavigatorSectionItem
              key={childId}
              id={childId}
              entityId={entityId}
              icon={icon}
              color={color}
              route={route}
              params={params}
            />
          ))}
      </List>
    </React.Fragment>
  );
}

NavigatorSection.propTypes = {
  entityId: PropTypes.string,
  section: PropTypes.string,
  items: PropTypes.array
};

NavigatorSection.defaultProps = {
  entityId: undefined,
  section: "",
  items: null
};

export default NavigatorSection;
