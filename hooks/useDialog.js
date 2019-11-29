import { useCallback, useContext } from 'react';
import DialogContext from '../contexts/dialog';

export default function useDialog(Component) {
  const { pushDialog, popDialog } = useContext(DialogContext);

  const openDialog = useCallback((props) => {
    pushDialog([Component, props]);
  }, []);

  const closeDialog = useCallback(() => {
    popDialog();
  }, []);

  return { openDialog, closeDialog };
}
