import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import platformsScheme from '../constants/platform';
import Grid from '@material-ui/core/Grid';
import FormField from './FormField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import useDialog from '../hooks/useDialog';
import usePlatforms from '../hooks/usePlatforms';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import usePlatformCreate from '../hooks/usePlatformCreate';
import { changeDraft } from "actions/platforms";

export default function PlatformDialog() {
  const { closeDialog } = useDialog(PlatformDialog);
  const platforms = usePlatforms();
  const draft = useSelector(state =>
    _.get(state, ["pages", "platforms", "draft"])
  );
  const dispatch = useDispatch();
  const onCreate = usePlatformCreate();

  return (
    <Dialog open={true} noValidate autoComplete="off">
      <form onSubmit={onCreate}>
        <DialogTitle>
          {
            (() => {
              switch (true) {
                case draft && !!draft.clone:
                  return "Clone platform";

                default:
                  return "Create platform";
              }
            })()
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              (() => {
                switch (true) {
                  case draft && !!draft.clone:
                    return "To clone an existing platform, please specify its name and source platform.";

                  default:
                    return "To create a new platform, please specify its name.";
                }
              })()
            }
          </DialogContentText>
          {draft && platformsScheme
            .map((field, index) => (
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
                  other={{ platforms }}
                  onChangeHandler={e => dispatch(changeDraft(field.name, e.target.value))}
                />
              </Grid>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {
              (() => {
                switch (true) {
                  case draft && !!draft.clone:
                    return "Clone platform";

                  default:
                    return "Create platform";
                }
              })()
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
