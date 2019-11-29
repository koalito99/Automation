import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Drawer from "@material-ui/core/Drawer";
import NavigatorHeader from "./NavigatorHeader";
import useDrawerToggle from "../hooks/useDrawerToggle";
import NavigatorSection from "./NavigatorSection";

const useStyles = makeStyles({
  paper: {
    width: 300,
    borderRight: "none"
  }
});

function Navigator(props) {
  const { entityId, variant, sections } = props;
  const [open, onClose] = useDrawerToggle();
  const classes = useStyles();
  return (
    <Drawer
      {...{ variant, open, onClose }}
      PaperProps={{ elevation: 2, classes: { root: classes.paper } }}
    >
      <NavigatorHeader />
      {sections &&
        sections.map(({ section, items: sectionItems }, index) => {
          const items = sectionItems && sectionItems.filter(({ visible }) => visible !== false);
          if (!items.length) return;
          return <NavigatorSection key={section || index} {...{ section, items, entityId }} />;
        })}
    </Drawer>
  );
}

Navigator.propTypes = {
  entityId: PropTypes.string,
  variant: PropTypes.string,
  sections: PropTypes.array
};

Navigator.defaultProps = {
  entityId: undefined,
  variant: "permanent",
  sections: null
};

export default Navigator;
