import React from "react";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

function AddButton({ allowCreate, onAdd }) {
  if (!allowCreate) return null;

  return (
    <IconButton onClick={onAdd} style={{ color: "white" }}>
      <AddIcon />
    </IconButton>
  );
}

export default AddButton;
