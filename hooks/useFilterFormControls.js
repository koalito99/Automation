import useRouteParams from './useRouteParams';
import useFirestore from './useFirestore';
import { useCallback } from 'react';
import useAuth from './useAuth';
import { Router } from '../routes';
import { STATE_TYPES } from 'blondie-platform-common';

const extractFilters = (searchState) => {
  const keys = ["refinementList", "toggle", "range"];

  return keys.reduce((acc, key) => {
    if (searchState[key]) {
      acc = { ...acc, ...searchState[key] };
    }

    return acc;
  }, {});
};

export default function useFilterFormControls(searchState, popDialog, onFilterDrawerClose, setView) {
  const { platformId, entityId, ...otherParams } = useRouteParams();
  const firestore = useFirestore();
  const auth = useAuth();

  const onSaveHandler = useCallback(async (draft) => {
    const filters = extractFilters(searchState);
    const changes = {
      type: "table",
      platform: firestore.collection("platforms").doc(platformId),
      entity: firestore.collection("entities").doc(entityId),
      name: draft.name,
      uid: draft.visibleOnlyForUser ? auth.uid : null,
      filters,
      state: "active"
    };

    if (searchState.query) {
      changes.query = searchState.query;
    }

    if (draft.id) {
      await firestore
        .collection("views")
        .doc(draft.id)
        .set(changes, { merge: true });

      setView({ ...draft, ...changes });
    } else {
      const { id } = await firestore.collection("views").add(changes);

      Router.pushRoute('resources', { platformId, entityId, view: id });
    }

    onFilterDrawerClose();
  }, [searchState, otherParams]);

  const onDeleteHandler = useCallback(async (viewId) => {
    await firestore.collection("views").doc(viewId).update({ state: STATE_TYPES.DELETED });

    popDialog();
    onFilterDrawerClose();

    Router.pushRoute("resources", { platformId, entityId, view: "my" });
  }, []);

  return { onSaveHandler, onDeleteHandler };
}
