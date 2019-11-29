import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { withFirebase, withFirestore } from 'react-redux-firebase';
import DropzoneComponent from '../../components/Dropzone';

export default compose(
  withFirebase,
  withFirestore,
  withState('showOverlay', 'setShowOverlay', false),
  withHandlers({
    onDrop: ({ setShowOverlay, onUpload }) => (files) => {
      setShowOverlay(false);

      onUpload(files);
    },
    onDragEnter: ({ setShowOverlay }) => () => {
      setShowOverlay(true);
    },
    onDragLeave: ({ setShowOverlay }) => () => {
      setShowOverlay(false);
    }
  })
)(DropzoneComponent);
