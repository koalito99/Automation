import React from "react";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";

function FiltersToggle({ onToggle }) {
  return (
    <IconButton onClick={onToggle} style={{ color: "white" }}>
      <FilterListIcon />
    </IconButton>
  );
}

export default FiltersToggle;
