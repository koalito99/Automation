import React, { Fragment } from "react";

import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import { withStyles } from "@material-ui/core/styles";

import RelatedListDetailsRecord from "./RelatedListDetailsRecord";
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = theme => ({
  table: {
    margin: "0 -24px -24px -24px",
    width: "calc(100% + 24px * 2)",
    overflowX: "auto"
  },
  searchBar: {
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  },
  searchInput: {
    fontSize: theme.typography.fontSize
  },
  block: {
    display: "block"
  },
  tableRow: {
    cursor: "pointer",
    "& button": {
      visibility: "hidden"
    },
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
      "& button": {
        visibility: "visible"
      }
    },
    "&:last-child th, &:last-child td": {
      borderBottom: "none"
    }
  },
  emptyState: {
    padding: theme.spacing(2)
  },
  idCell: {
    textTransform: "uppercase",
    color: theme.palette.grey[600]
  },
  title: {
    paddingRight: "0px !important"
  },
  fab: {
    position: "absolute",
    right: theme.spacing(6),
    top: 12
  }
});

const RelatedListDetails = props => {
  const { groupedRecords, onUnlinkHandler, onEditHandler, onDeleteHandler, classes } = props;

  if (!groupedRecords || groupedRecords.length === 0) {
    return (
      <div className={classes.emptyState}>
        <Typography color="textSecondary" align="center" className={classes.placeholder}>
          {typeof groupedRecords === "undefined" ? (
            <CircularProgress />
          ) : (
            "There is nothing here yet. Start creating by clicking Add button above."
          )}
        </Typography>
      </div>
    );
  }

  return (
    <List dense disablePadding>
      {
        groupedRecords &&
      groupedRecords.length > 0 && (
        <Fragment>
          {
            groupedRecords.map((groupedRecord) => (
              <Fragment key={groupedRecord}>
                {
                  groupedRecords.length > 1 && <ListSubheader>
                    {groupedRecord.entity.name}
                  </ListSubheader>
                }
                {
                  groupedRecord.records.map(record => (
                    <RelatedListDetailsRecord
                      key={record.id}
                      {...{ entityId: groupedRecord.entity.id, record, onUnlinkHandler, onEditHandler, onDeleteHandler }}
                    />
                  ))
                }
              </Fragment>
            ))
          }
        </Fragment>
      )
      }
    </List>
  );
};

export default withStyles(styles)(RelatedListDetails);
