import React, { useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import FormField from "containers/FormField";
import useDialog from "hooks/useDialog";
import withDraft from "helpers/withDraft";

const useStyles = makeStyles(theme => ({
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
}));

const ModifyTableItemDialog = ({
  id,
  draft = {},
  resource,
  onSave,
  onCancel,
  onDelete,
  setSelected,
  selected,
  other
}) => {
  const classes = useStyles();
  const { closeDialog } = useDialog(ModifyTableItemDialog);

  useEffect(() => setSelected([]), []);

  const closeDialogAfterAction = fn => {
    fn(event, () => {
      closeDialog();
    });
  };

  const saveAndCloseDialog = useCallback(() => closeDialogAfterAction(onSave), [onSave]);
  const deleteAndCloseDialog = useCallback(() => closeDialogAfterAction(onDelete), [onDelete]);
  const cancelAndCloseDialog = useCallback(() => closeDialogAfterAction(onCancel), [onCancel]);
  const getFieldProps = useCallback(
    field => {
      const defaultProps = {
        field: {
          ...field,
          id: field.name,
          name: field.label,
          type: {
            type: field.type
          }
        },
        options: field.options
      };
      if (field.name === "defaultValue") {
        const draftTypeId = draft.type && draft.type.id;
        return {
          field: {
            ...defaultProps.field,
            type: {
              type: _.get(other, ["types", draftTypeId, "type"])
            }
          },
          options: _.get(other, ["types", draftTypeId, "options"], [])
        };
      }
      return defaultProps;
    },
    [draft]
  );

  const isUpdate = !!id;
  const isMassUpdate = selected && selected.length;

  return (
    <Dialog open noValidate autoComplete="off" maxWidth="md">
      <DialogTitle>{isUpdate || isMassUpdate ? "Update" : "Add new"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {resource.schema
            .filter(
              ({ skipForm, visible }) =>
                !skipForm && (typeof visible === "undefined" || visible(draft || {}))
            )
            .map((field, index) => (
              <Grid item xs={field.xs || "auto"} sm={field.sm || false} key={field.name}>
                <FormField
                  autoFocus={index === 0}
                  fullWidth
                  margin="none"
                  entityId={resource.type}
                  id={id}
                  valueMutate={field.valueMutate}
                  onChangeMutate={field.onChangeMutate}
                  other={other}
                  {...getFieldProps(field)}
                />
              </Grid>
            ))}
        </Grid>
      </DialogContent>
      <DialogActions className={classes.actions}>
        {id ? (
          <Button color="secondary" onClick={deleteAndCloseDialog}>
            Delete
          </Button>
        ) : (
          <span />
        )}
        <div>
          <Button onClick={cancelAndCloseDialog}>Cancel</Button>
          <Button onClick={saveAndCloseDialog} variant="contained" color="primary">
            {isUpdate || isMassUpdate ? "Update" : "Create"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default withDraft()(ModifyTableItemDialog);
