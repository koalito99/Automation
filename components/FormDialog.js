import React, { useEffect, useContext, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReduxFirestoreContext } from "react-redux-firebase";
import withStyles from "@material-ui/core/styles/withStyles";
import { Dialog, DialogContent, DialogTitle, Button, Fade, LinearProgress, DialogActions } from "@material-ui/core";

import actionTypes from 'constants/actionTypes';
import RecordForm from './RecordForm';
import Record from "../helpers/Record";
import useDraft from "../hooks/useDraft";
import useConfiguration from "../hooks/useConfiguration";
import useEntity from '../hooks/useEntity';

const styles = theme => ({
  dialogContent: {
    padding: 0
  },
  records: {
    width: "60vw",
    height: "60vh",
  }
});

function FormDialog(props) {
  const { entityId, recordId, relationId, parentRecordId, open = false, onSubmit, onClose, classes } = props;
  const dispatch = useDispatch();
  const configuration = useConfiguration();
  const auth = useSelector(state => state.firebase.auth);
  const firestore = useContext(ReduxFirestoreContext);
  const [loading, setLoading] = useState(false);
  const entity = useEntity(entityId);
  const relation = relationId && configuration.relations.data[relationId];

  useEffect(() => {
    const fn = async () => {
      setLoading(true);

      let draft;

      if (recordId && recordId !== "new") {
        const draftDoc = await firestore.collection('records').doc(recordId).get();
        draft = { id: draftDoc.id, ...draftDoc.data() };
      } else {
        const fields = entity.fields.ordered;
        draft = fields.reduce((cum, field) => {
          if (!!field.relation && field.relation.id === relationId) {
            cum[field.id] = parentRecordId;
          }
          return cum;
        }, {});
      }

      dispatch({
        type: actionTypes.DRAFT.DRAFT_SET,
        payload: { entityId, id: recordId || "new", draft }
      });

      setLoading(false);
    };

    if (open) {
      fn();
    }
  }, [open, entityId, recordId, relationId]);

  const draft = useDraft(entityId, recordId || "new");

  const onSave = useCallback(async () => {
    setLoading(true);

    const record = new Record(firestore, configuration, entityId, draft, auth, parentRecordId, relation);

    await record.save();

    setLoading(false);

    if (!_.isEmpty(record.errors)) {
      dispatch({
        type: actionTypes.DRAFT.ERRORS_SET,
        payload: { entityId, id: recordId || "new", errors: record.errors }
      });
    } else {
      onClose();
    }
  }, [entityId, recordId, draft, parentRecordId, relation]);

  return (
    <Dialog scroll="body" maxWidth="md" {...{ open, onClose }}>
      <Fade
        in={loading}
        style={{
          transitionDelay: loading ? '800ms' : '0ms',
        }}
      >
        <LinearProgress variant="query" />
      </Fade>
      <DialogTitle>{recordId ? "Update" : "Create"} {entity ? entity.name.toLowerCase() : 'record'}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <RecordForm {...{ entityId, recordId: recordId || "new", onSave }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withStyles(styles)(FormDialog);
