import Button from '@material-ui/core/Button';
import React, { useCallback, useEffect, useState } from 'react';
import useRouteParams from '../hooks/useRouteParams';
import useFirestore from '../hooks/useFirestore';

export default function FilterDialogOpener({ onFilterDrawerClose, openDialog, searchState }) {
  const { view: viewId } = useRouteParams();
  const [view, setView] = useState(null);
  const firestore = useFirestore();

  useEffect(() => {
    const fn = async () => {
      const viewDoc = await firestore
        .collection("views")
        .doc(viewId)
        .get();

      const view = viewDoc.exists ? { ...viewDoc.data(), id: viewDoc.id } : null;

      setView(view);
    };

    fn();
  }, [viewId]);

  const open = useCallback(() => {
    openDialog({ view, setView, searchState, onFilterDrawerClose });
  }, [view, searchState]);

  return (
    <Button onClick={open} fullWidth variant="outlined" color="primary">
      {view ? "Update" : "Create"} filter
    </Button>
  );
}
