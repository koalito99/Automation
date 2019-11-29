import React from "react";
import { withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import FieldValue from "containers/FieldValue";
import useEntityView from '../../hooks/useEntityView';

const styles = theme => ({
  paper: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  root: {
    height: "100%"
  },
  header: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  headerInner: {
    background: '#fff'
  }
});

function MasterKanban(props) {
  const { hits, view, fields, classes, onEditHandler } = props;

  const entityView = useEntityView(view);
  const groupByFieldId = entityView.groupBy.id;
  const groupByField = fields[groupByFieldId];
  const groupedHits = _.groupBy(hits, groupByFieldId);

  const primaryField = fields[entityView.primary.id];
  const secondaryField = fields[entityView.secondary.id];

  return (
    <Grid container spacing={2}>
      {_([...groupByField.type.options, undefined])
        .map(column => (
          <Grid item xs className={classes.verticalBorder}>
            <Paper className={classes.paper}>
              <List
                dense
                subheader={
                  <ListSubheader component="div" className={classes.header}>
                    <div className={classes.headerInner}>
                      {column || "Uncategorized"}
                    </div>
                  </ListSubheader>
                }
                className={classes.root}
              >
                {(groupedHits[column] || []).map(hit => (
                  <>
                    <Divider light />
                    <ListItem button onClick={onEditHandler(hit)}>
                      <ListItemText
                        primary={<FieldValue field={primaryField} record={hit} />}
                        secondary={<FieldValue field={secondaryField} record={hit} />}
                      />
                    </ListItem>
                  </>
                ))}
              </List>
            </Paper>
          </Grid>
        ))
        .value()}
    </Grid>
  );
}

export default withStyles(styles)(MasterKanban);
