import React, { Component } from 'react';
import { compose } from 'recompose';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import { withStyles, Paper, Typography, CircularProgress } from '@material-ui/core';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,0.5);
  text-align: center;
  color: #fff;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const styles = theme => ({
  dropZone: {
    width: '100%',
    position: 'relative',
    height: '200px',
    borderWidth: '2px',
    borderColor: 'rgb(102, 102, 102)',
    borderStyle: 'dashed',
    borderRadius: '5px',
  },
  paper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  },
  overlayText: {
    color: '#ffffff'
  }
});

const Field = function ({
  readOnly,
  accept,
  fileDropText,
  classes,
  dropzoneActive,
  isLoading,
  files,
  showFiles,
  onDragLeave,
  onDragEnter,
  handleFilesDrop
}) {
  return (
    <Dropzone
      onDrop={handleFilesDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      disabled={readOnly}
      accept={accept}
      className={classes.dropZone}
    >
      {
        dropzoneActive && !isLoading && <Overlay>
          <Typography variant='h6' className={classes.overlayText}>
            Drop File
          </Typography>
        </Overlay>
      }
      {
        !dropzoneActive && <Paper className={classes.paper}>
          {
            isLoading
              ? <CircularProgress size={24} />
              : <Typography variant='h6'>
                {
                  showFiles && files.length
                    ? files.map((file) => <div>{file.name}</div>)
                    : <span>
                      {fileDropText}
                    </span>
                }
              </Typography>
          }
        </Paper>
      }
    </Dropzone>
  );
};

export default compose(
  withStyles(styles)
)(Field);
