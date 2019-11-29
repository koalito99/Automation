import React, { useCallback, useState, useEffect } from "react";

import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Fade from "@material-ui/core/Fade";
import Icon from "./Icon";

const styles = theme => ({
  root: {
    width: "100%"
  },
  icon: {
    position: "relative",
    top: 1
  },
  iframe: {
    border: "none",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%"
  },
  back: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
    width: "100%"
  },
  details: {
    padding: 0,
    position: "relative"
  }
});

const RelatedWidget = ({ widget, src, expanded, setExpanded, classes }) => {
  const [loading, setLoading] = useState(true);
  const onLoad = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!expanded) {
      setLoading(true);
    }
  });

  return (
    <>
      <ExpansionPanel
        expanded={expanded}
        className={classes.root}
        onChange={(e, expanded) => setExpanded(expanded)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container alignItems="center" alignContent="center" spacing={2}>
            <Grid item>
              <Icon name={widget.icon} color={widget.color} className={classes.icon} />
            </Grid>
            <Grid item xs>
              <Typography variant="body1">{widget.title}</Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Fade in={loading}>
            <div className={classes.back}>
              <CircularProgress />
            </div>
          </Fade>

          {expanded && <iframe src={src} className={classes.iframe} onLoad={onLoad} />}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  );
};

export default withStyles(styles)(RelatedWidget);
