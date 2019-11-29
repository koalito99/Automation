import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ReduxFirestoreContext } from "react-redux-firebase";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  LinearProgress,
  makeStyles
} from "@material-ui/core";

import actionTypes from 'constants/actionTypes';
import RecordForm from './RecordForm';
import useDraft from "../hooks/useDraft";

const useStyles = makeStyles({
  dialogContent: {
    padding: 0
  },
  records: {
    width: "60vw",
    height: "60vh",
  }
});

function AttributionsDialog(props) {
  const { linkId, fields, recordId, open = true, popDialog } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const firestore = useContext(ReduxFirestoreContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fn = async () => {
      setLoading(true);

      let draft;

      if (linkId) {
        const draftDoc = await firestore.collection('links').doc(linkId).get();
        draft = { id: draftDoc.id, ...draftDoc.data() };
      }

      dispatch({
        type: actionTypes.DRAFT.DRAFT_SET,
        payload: { entityId: "links", id: linkId, draft }
      });

      setLoading(false);
    };

    if (open) {
      fn();
    }
  }, [linkId]);

  const draft = useDraft("links", linkId);

  const onSave = useCallback(async () => {
    setLoading(true);

    // @Shavluga 25.09.2019 16:56 process validation, auto field calculations, field filtering here
    const filteredDraft = fields.reduce((acc, field) => {
      if (draft[field.id]) {
        acc[field.id] = draft[field.id];
      }

      return acc;
    }, {});

    await firestore.collection("links").doc(linkId).update(filteredDraft);

    setLoading(false);

    const errors = {};

    if (!_.isEmpty(errors)) {
      dispatch({
        type: actionTypes.DRAFT.ERRORS_SET,
        payload: { entityId: "links", id: recordId || "new", errors }
      });
    } else {
      popDialog();
    }
  }, [draft, linkId]);

  return (
    <Dialog scroll="body" maxWidth="md" {...{ open, onClose: popDialog }}>
      <Fade
        in={loading}
        style={{
          transitionDelay: loading ? '800ms' : '0ms',
        }}
      >
        <LinearProgress variant="query" />
      </Fade>
      <DialogTitle>Update attributions</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <RecordForm {...{ entityId: "links", recordId: linkId, onSave, fields }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={popDialog}>
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AttributionsDialog;
