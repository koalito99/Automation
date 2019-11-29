import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import FormField from "containers/FormField";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  emptyTableRow: {
    "& th": {
      borderBottom: "none"
    }
  },
  inlineEditor: {
    margin: "-10px -30px",
    padding: "20px",
    position: "relative"
  },
  inlineEditorForm: {
    display: "flex"
  },
  actions: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    "& button": {
      marginLeft: theme.spacing(2),
      "&:first-child": {
        marginLeft: 0
      }
    }
  }
});

function TableViewFormRow({ id, draft, resource, onSave, onCancel, onDelete, classes, other }) {
  return (
    <TableRow className={classes.emptyTableRow}>
      <TableCell
        component="th"
        scope="row"
        colSpan={resource.schema.filter(({ skipList }) => !skipList).length + 1}
      >
        <form onSubmit={onSave} noValidate autoComplete="off">
          <Paper className={classes.inlineEditor}>
            <Typography variant="subtitle1" gutterBottom>
              {id ? "Update" : "Add new"}
            </Typography>
            <div className={classes.inlineEditorForm}>
              <Grid container spacing={resource.detailed ? 0 : 2}>
                {resource.schema
                  .filter(
                    ({ skipForm, visible }) =>
                      !skipForm && (typeof visible === "undefined" || visible(draft))
                  )
                  .map((field, index) => (
                    <Grid item xs={field.xs || "auto"} key={field.name}>
                      <FormField
                        autoFocus={index === 0}
                        fullWidth
                        margin="none"
                        entityId={resource.type}
                        id={id}
                        field={{
                          ...field,
                          id: field.name,
                          name: field.label,
                          type: {
                            type: field.type
                          }
                        }}
                        options={field.options}
                        valueMutate={field.valueMutate}
                        onChangeMutate={field.onChangeMutate}
                        other={other}
                      />
                    </Grid>
                  ))}
              </Grid>
            </div>
            <div className={classes.actions}>
              {id ? (
                <Button color="secondary" onClick={onDelete}>
                  Delete
                </Button>
              ) : (
                <span />
              )}
              <div>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                  {id ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </Paper>
        </form>
      </TableCell>
    </TableRow>
  );
}

export default withStyles(styles)(TableViewFormRow);
