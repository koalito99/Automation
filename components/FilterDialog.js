import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import scheme from '../constants/filter';
import Grid from '@material-ui/core/Grid';
import FormField from './FormField';
import validateDraft from '../helpers/validateDraft';
import useFilterFormControls from '../hooks/useFilterFormControls';
import FIELD_TYPES from '../constants/fieldTypes';

const useStyles = makeStyles(theme => ({
  dialogContent: {
    width: "50vw",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(2)
  }
}));

export default function FilterDialog({ onFilterDrawerClose, popDialog, searchState, view, setView }) {
  const [draft, setDraft] = useState(view ? { ...view, visibleOnlyForUser: !!view.uid } : {});
  const [errors, setErrors] = useState({});
  const classes = useStyles();
  const { onSaveHandler, onDeleteHandler } = useFilterFormControls(searchState, popDialog, onFilterDrawerClose, setView);

  const onDraftChange = useCallback((field, value) => {
    setDraft((currentDraft) => {
      const errorsCopy = { ...errors };
      delete errorsCopy[field];

      setErrors(errorsCopy);

      return { ...currentDraft, [field]: value };
    });
  }, [errors]);

  const onSave = useCallback(() => {
    const errors = validateDraft(draft, scheme);

    if (!_.isEmpty(errors)) {
      setErrors(errors);

      return;
    }

    onSaveHandler(draft);

    popDialog();
  }, [draft]);

  const onDelete = useCallback(async () => {
    onDeleteHandler(draft.id);
  }, [draft]);

  return (
    <Dialog scroll="body" maxWidth="md" open onClose={popDialog}>
      <DialogTitle>{draft.id ? "Update" : "Create"} filter</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {scheme.map((field, index) => (
          <Grid item xs={field.xs || "auto"} key={field.name}>
            <FormField
              autoFocus={index === 0}
              fullWidth
              id={field.name}
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
              fieldValue={draft[field.name]}
              value={draft[field.name]}
              error={errors[field.name]}
              onChangeHandler={e => onDraftChange(field.name, field.type === FIELD_TYPES.BOOLEAN ? e : e.target.value)}
            />
          </Grid>
        ))}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <div>
          {
            draft.id && <Button onClick={onDelete} color="secondary">
              Delete
            </Button>
          }
        </div>
        <div>
          <Button onClick={popDialog}>
            Cancel
          </Button>
          <Button onClick={onSave} color="primary">
            {draft.id ? "Update" : "Create"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
