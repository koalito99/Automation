import _ from "lodash";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";

function FieldAdornment(props) {
  const { position, children } = props;

  if (!children) return null;

  return useMemo(
    () => (
      <InputAdornment {...{ position }}>
        {React.Children.map(children, child =>
          _.isString(child) ? (
            <Typography variant="body2" color="textSecondary" noWrap>
              {child}
            </Typography>
          ) : (
            child
          )
        )}
      </InputAdornment>
    ),
    [position, children]
  );
}

FieldAdornment.propTypes = {
  position: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default FieldAdornment;
