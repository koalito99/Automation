import React, { Component } from 'react';
import UploadFieldComponent from '../../components/UploadField';

class UploadField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropzoneActive: false,
      isLoading: false
    };
  }

  onDragEnter = () => {
    this.setState({ dropzoneActive: true });
  };

  onDragLeave = () => {
    this.setState({ dropzoneActive: false });
  };

  showError = (message) => {
    alert(message);
  };

  handleFilesDrop = async (accepted, rejected) => {
    const { readOnly, onChangeHandler, fileCount, accept } = this.props;

    this.setState({ dropzoneActive: false });

    if (readOnly) {
      return;
    }

    if (rejected.length) {
      const formats = _.isArray(accept) ? accept.map((type) => type.split('/').pop()).join(', ') : accept.split('/').pop();

      return void this.showError(`File must be in ${formats} format!`);
    }

    this.setState({ isLoading: true });

    if (fileCount && accepted.length !== fileCount) {
      this.setState({ isLoading: false });

      return void this.showError(`Invalid Input. Should be ${fileCount} file${fileCount > 1 ? 's' : ''}`);
    }

    await onChangeHandler(accepted);

    this.setState({ isLoading: false });
  };

  render() {
    const { dropzoneActive, isLoading } = this.state;
    const { readOnly, accept, fileDropText, files, showFiles } = this.props;

    return (
      <UploadFieldComponent
        accept={accept}
        fileDropText={fileDropText}
        readOnly={readOnly}
        dropzoneActive={dropzoneActive}
        isLoading={isLoading}
        files={files}
        showFiles={showFiles}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        handleFilesDrop={this.handleFilesDrop}
      />
    );
  }
}

UploadField.defaultProps = {
  readOnly: false,
  fileDropText: "Drop file",
  showFiles: true
};

export default UploadField;
