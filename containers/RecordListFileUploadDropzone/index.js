import React from 'react';
import { compose } from 'recompose';
import withRecordFileUploadAndCreate from '../../helpers/withRecordFileUploadAndCreate';
import Dropzone from '../Dropzone';

export default compose(
  withRecordFileUploadAndCreate,
)(Dropzone);
