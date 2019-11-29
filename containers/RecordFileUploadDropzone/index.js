import React from 'react';
import { compose } from 'recompose';
import withRecordFileUpload from '../../helpers/withRecordFileUpload';
import Dropzone from '../Dropzone';

export default compose(
  withRecordFileUpload,
)(Dropzone);
