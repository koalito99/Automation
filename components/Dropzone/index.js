import React from "react";
import ReactDropzone from "react-dropzone";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DropzoneOverlay from "../../components/DropzoneOverlay";

const useStyles = makeStyles({
  dropzone: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    position: "static !important"
  }
});

function Dropzone({ children, showOverlay, onDrop, onDragEnter, onDragLeave }) {
  const classes = useStyles();

  return (
    <ReactDropzone
      style={{}}
      className={classes.dropzone}
      disableClick
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <DropzoneOverlay show={showOverlay}>{children}</DropzoneOverlay>
    </ReactDropzone>
  );
}

export default Dropzone;
