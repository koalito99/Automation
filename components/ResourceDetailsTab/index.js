import React from "react";
import Tab from "@material-ui/core/Tab";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  tab: {
    maxWidth: 999
  },
  padding: {
    padding: `0 ${theme.spacing(2)}px`
  }
});

function ResourceDetailsTab({ config, classes, record, ...props }) {
  return (
    <Tab
      className={classes.tab}
      label={
        config.badgeContent ? (
          <Badge
            color="primary"
            badgeContent={config.badgeContent(record)}
            invisible={!config.badgeContent(record)}
            className={classes.padding}
          >
            {config.label}
          </Badge>
        ) : (
          config.label
        )
      }
      {...props}
    />
  );
}

export default withStyles(styles)(ResourceDetailsTab);
