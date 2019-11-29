import React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

function DeleteButton(props) {
  const { onDelete } = props;

  return (
    <IconButton color="secondary" onClick={onDelete}>
      <DeleteIcon />
    </IconButton>
  );
}

export default DeleteButton;
