import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

function SearchToggle(props) {
  const { onSearchToggle } = props;

  return (
    <IconButton style={{ color: "white" }} onClick={onSearchToggle}>
      <SearchIcon />
    </IconButton>
  );
}

SearchToggle.propTypes = {
  classes: PropTypes.object.isRequired
};

export default SearchToggle;
