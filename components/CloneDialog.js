import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade, LinearProgress,
  makeStyles
} from "@material-ui/core";
import RecordForm from './RecordForm';
import { useDispatch, useSelector } from 'react-redux';
import useConfiguration from '../hooks/useConfiguration';
import { ReduxFirestoreContext } from 'react-redux-firebase';
import actionTypes from '../constants/actionTypes';
import useDraft from '../hooks/useDraft';
import Record from '../helpers/Record';
import { useSnackbar } from 'notistack';
import { Router } from "../routes";
import useRouteParams from '../hooks/useRouteParams';

const useStyles = makeStyles({
  dialogContent: {
    padding: 0
  },
  records: {
    width: "60vw",
    height: "60vh"
  }
});

function CloneDialog(props) {
  const { entityId, recordId, open = true, popDialog } = props;
  const classes = useStyles();

  const dispatch = useDispatch();
  const configuration = useConfiguration();
  const auth = useSelector(state => state.firebase.auth);
  const firestore = useContext(ReduxFirestoreContext);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { platformId, path } = useRouteParams();

  useEffect(() => {
    const fn = async () => {
      setLoading(true);

      let draft;
      const draftDoc = await firestore.collection('records').doc(recordId).get();
      draft = { ...draftDoc.data() };

      delete draft.id;
      delete draft.storageRefs;

      dispatch({
        type: actionTypes.DRAFT.DRAFT_SET,
        payload: { entityId, id: "clone", draft }
      });

      setLoading(false);
    };

    fn();
  }, [entityId, recordId]);

  const draft = useDraft(entityId, "clone");

  const onSave = useCallback(async () => {
    setLoading(true);

    const record = new Record(firestore, configuration, entityId, draft, auth);

    await record.save();

    setLoading(false);

    if (!_.isEmpty(record.errors)) {
      dispatch({
        type: actionTypes.DRAFT.ERRORS_SET,
        payload: { entityId, id: "clone", errors: record.errors }
      });
    } else {
      const action = (key) => (
        <Fragment>
          <Button onClick={() => {
            Router.pushRoute("resource", { platformId, entityId, id: record.attrs.id, path });
            closeSnackbar(key);
          }}>
            Open
          </Button>
        </Fragment>
      );

      enqueueSnackbar('Record has been cloned successfully!', {
        variant: 'success',
        action
      });
      popDialog();
    }
  }, [entityId, recordId, draft]);

  return (
    <Dialog scroll="body" maxWidth="xl" {...{ open }}>
      <Fade
        in={loading}
        style={{
          transitionDelay: loading ? '800ms' : '0ms',
        }}
      >
        <LinearProgress variant="query" />
      </Fade>
      <DialogTitle>Clone record</DialogTitle>
      <Divider light />
      <DialogContent className={classes.dialogContent}>
        <RecordForm entityId={entityId} recordId="clone" />
      </DialogContent>
      <DialogActions>
        <Button onClick={popDialog}>
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Clone
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CloneDialog;
