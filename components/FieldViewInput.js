import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import RelatedLink from "./RelatedLink";
import FormattedValue from "./FormattedValue";

const useStyles = makeStyles({
  container: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    minHeight: "1.1875em",
    height: "auto"
  }
});

function FieldViewInput(props) {
  const { type, relation, value, className } = props;
  const classes = useStyles();

  const valueComponent = relation ? (
    <RelatedLink
      {...{
        recordId: value ? value.id || value : null
      }}
    />
  ) : (
    <FormattedValue {...{ value, type }} />
  );

  return (
    <div className={cn(classes.container, className)}>{valueComponent}</div>
  );
}

FieldViewInput.propTypes = {
  ...FormattedValue.propTypes,
  className: PropTypes.string
};

export default FieldViewInput;
