import _ from "lodash";
import { compose, withHandlers } from "recompose";

import { Router } from "../routes";

import { STATE_TYPES } from "blondie-platform-common";

export default ({ routes }) =>
  compose(
    withHandlers({
      onCancel: ({ platformId, entityId, view }) => () => {
        Router.pushRoute(routes.index, { platformId, entityId, view });
      },
      onAdd: ({ platformId, entityId, view }) => () => {
        Router.pushRoute(routes.new, { platformId, entityId, view });
      },
      onEditHandler: ({ platformId, entityId, view }) => ({ objectID, id }) => () => {
        Router.pushRoute(routes.show, { platformId, entityId, id: objectID || id, view });
      }
    }),
    withHandlers({
      onDeleteSelected: ({ firestore, entityId, onCancel, setIndexing }) => selected => {
        firestore.runTransaction(transaction =>
          Promise.all(
            selected.map(id =>
              transaction.update(firestore.doc(`records/${id}`), { state: STATE_TYPES.DELETED })
            )
          )
        );
        setIndexing(true);
        onCancel();
      },
      onRestoreSelected: ({ firestore, entityId, onCancel, setIndexing }) => selected => {
        firestore.runTransaction(transaction =>
          Promise.all(
            selected.map(id =>
              transaction.update(firestore.doc(`records/${id}`), { state: STATE_TYPES.ACTIVE })
            )
          )
        );
        setIndexing(true);
        onCancel();
      },
      onDeleteHandler: ({ firestore, entityId, onCancel, setIndexing }) => ({
        objectID,
        id
      }) => () => {
        firestore.update(`records/${objectID || id}`, { state: STATE_TYPES.DELETED });
        setIndexing(true);
        onCancel();
      },
      onRestoreHandler: ({ firestore, entityId, onCancel, setIndexing }) => ({
        objectID,
        id
      }) => () => {
        firestore.update(`records/${objectID || id}`, { state: STATE_TYPES.ACTIVE });
        setIndexing(true);
        onCancel();
      }
    })
  );
