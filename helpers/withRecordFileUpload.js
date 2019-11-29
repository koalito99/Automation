import _ from "lodash";
import { compose, withHandlers } from "recompose";
import { withFirebase, withFirestore } from 'react-redux-firebase';
import withRouterParams from './withRouterParams';
import withFileUpload from './withFileUpload';

export default compose(
    withFirebase,
    withFirestore,
    withRouterParams('platformId'),
    withFileUpload,
    withHandlers({
      onUpload: ({ uploadToStorage, recordId, firestore, firebase, platformId }) => async (files) => {
        if (!files.length) {
          return;
        }

        const ref = firestore.collection('records').doc(recordId);
        const snap = await ref.get();
        const record = snap.data();

        let storageRefs = record.storageRefs || [];
        const uploadedFiles = await Promise.all(files.map((file) => uploadToStorage(file, firebase, platformId, recordId)));

        storageRefs = [...storageRefs, ...uploadedFiles];
        const uniqueRefs = _.uniqBy(storageRefs, 'ref');

        await ref.update({
          storageRefs: uniqueRefs
        });
      }
    }),
  );
