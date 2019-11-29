import React, { useCallback } from "react";
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import EmptyState from "../EmptyState";
import useFirebase from "../../hooks/useFirebase";
import useFirestore from "../../hooks/useFirestore";
import useFieldValue from "../../hooks/useFieldValue";
import useRouteParams from "../../hooks/useRouteParams";

function ResourceFileList() {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const { entityId, id } = useRouteParams();
  const [storageRefs] = useFieldValue(entityId, id, 'storageRefs');
  const hasFiles = storageRefs && storageRefs.length > 0;

  const onDelete = useCallback(file => async e => {
    e.preventDefault();
    e.stopPropagation();

    if (!file.ref) {
      return;
    }

    const doDelete = confirm(`Are you sure to delete "${file.name}"?`);

    if (!doDelete) {
      return;
    }

    await firebase.deleteFile(file.ref);

    const withoutRemoved = storageRefs.filter(f => f.ref !== file.ref);

    firestore.collection('records').doc(id).update({
      storageRefs: withoutRemoved
    });
  }, [storageRefs, id]);

  const onDownload = useCallback(file => async () => {
    if (!file.ref) {
      return;
    }

    const storage = firebase.storage();

    try {
      window.location = await storage.ref(file.ref).getDownloadURL();
    } catch (e) {
      console.log(e);
    }
  }, []);

  return hasFiles
    ? (
      <List>
        {
          storageRefs.map(file => {
            return (
              <ListItem key={file.ref || file.id} button onClick={onDownload(file)}>
                <ListItemText secondary={file.name} />
                <ListItemSecondaryAction>
                  <IconButton variant="contained" color="secondary" onClick={onDelete(file)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })
        }
      </List>
    ) : (
      <EmptyState
        title="There is nothing here yet"
        description="Attach files by dragging them over here."
      />
    );
}

export default ResourceFileList;
