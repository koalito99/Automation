import React from "react";
import cn from "classnames";
import { withStyles } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import MasterRowCheckbox from "containers/MasterRowCheckbox";
import FieldValue from "containers/FieldValue";

import { STATE_TYPES } from "blondie-platform-common";
import MasterRowActions from "./MasterRowActions";

const styles = theme => ({
  tableRow: {
    "& button": {
      visibility: "hidden"
    },
    "&:hover": {
      "& button": {
        visibility: "visible"
      }
    },
    "& .ais-Highlight-highlighted": {
      fontStyle: "normal",
      backgroundColor: "yellow"
    }
  },
  clickableTableRow: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.grey[200]
    }
  },
  cell: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  }
});

function MasterRow(props) {
  const {
    id,
    entity,
    orderedTableViewFields,
    selectable,
    actionable,
    classes,
    allowEdit,
    allowDelete,
    onClickHandler,
    onEditHandler,
    onDeleteHandler,
    onRestoreHandler,
    onIconClickHandler
  } = props;

  return (
    <TableRow
      key={entity.objectID}
      className={cn(classes.tableRow, {
        [classes.clickableTableRow]: entity.state !== STATE_TYPES.DELETED,
      })}
      onClick={
        onClickHandler
          ? onClickHandler(entity)
          : entity.state !== STATE_TYPES.DELETED && allowEdit && onEditHandler(entity)
      }
    >
      {selectable && (
        <TableCell padding="checkbox">
          <MasterRowCheckbox id={entity.objectID} />
        </TableCell>
      )}
      {orderedTableViewFields.map(field => (
        <TableCell key={field.id} padding="dense" className={classes.cell}>
          <FieldValue {...{ field }} record={entity} />
        </TableCell>
      ))}
      {actionable && (
        <TableCell align="right">
          <MasterRowActions
            {...{
              entity,
              allowEdit,
              allowDelete,
              onEditHandler,
              onDeleteHandler,
              onRestoreHandler,
              onIconClickHandler
            }}
          />
        </TableCell>
      )}
    </TableRow>
  );
}

export default withStyles(styles)(MasterRow);
