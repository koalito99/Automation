import useFirestore from './useFirestore';
import { useDispatch, useSelector } from 'react-redux';
import { cancel } from "actions/platforms";
import { useCallback } from 'react';
import useDialog from './useDialog';
import PlatformDialog from '../components/PlatformDialog';
import useAuth from './useAuth';

export default function usePlatformCreate() {
  const { closeDialog } = useDialog(PlatformDialog);
  const firestore = useFirestore();
  const draft = useSelector(state =>
    _.get(state, ["pages", "platforms", "draft"])
  );

  const auth = useAuth();
  const dispatch = useDispatch();

  const onCreate = useCallback(async (e) => {
    e.preventDefault();

    const params = {
      title: draft.title,
      owner: auth.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (draft.clone) {
      params.clone = firestore.collection('platforms').doc(draft.clone);
    }

    await firestore.add("platforms", params);

    closeDialog();
    dispatch(cancel());
  }, [draft]);

  return onCreate;
}
