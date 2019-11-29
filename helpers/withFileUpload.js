import { compose, withHandlers } from "recompose";
import uuid from "uuid";

export default compose(
  withHandlers({
    uploadToStorage: () => (file, firebase, platformId, recordId) => {
      return new Promise((resolve) => {
        const storage = firebase.storage();
        const { name } = file;
        const uploadTask = storage.ref(`files/${platformId}/${recordId}/${uuid()}`).put(file, {
          contentDisposition: `attachment; filename="${name}"`,
        });

        uploadTask.on('state_changed', function (snapshot) {
        }, (e) => {
          console.log(e);
        }, () => {
          resolve({ ref: uploadTask.snapshot.ref.fullPath, name });
        });
      });
    },
  }),
);
