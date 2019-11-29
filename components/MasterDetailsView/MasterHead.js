import React from "react";
import { withStyles } from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";

const styles = {
  tableHead: {
    "& th": {
      padding: "0 40px 0 16px",
      whiteSpace: "nowrap",

      "&:first-child": {
        padding: "0 0 0 4px"
      }
    }
  }
};

function MasterHead({
  orderedTableViewFields,
  hits,
  selected,
  setSelected,
  selectable,
  actionable,
  classes
}) {
  return (
    <TableHead className={classes.tableHead}>
      <TableRow>
        {selectable && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selected.length > 0 && selected.length < hits.length}
              checked={hits.length > 0 && selected.length === hits.length}
              onChange={e => {
                setSelected(e.target.checked ? hits.map(hit => hit.objectID) : []);
              }}
            />
          </TableCell>
        )}
        {orderedTableViewFields.map(({ name, id }) => (
          <TableCell key={id}>{name}</TableCell>
        ))}
        {actionable && <TableCell />}
      </TableRow>
    </TableHead>
  );
}

export default withStyles(styles)(MasterHead);
