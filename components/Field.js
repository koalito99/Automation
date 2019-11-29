import React from "react";
import PropTypes from "prop-types";
import FieldEdit from "./FieldEdit";
import FieldView from "./FieldView";

function Field(props) {
  const { mode, readOnly, ...fieldProps } = props;

  switch (mode) {
    case "edit":
      if (readOnly) {
        return <FieldView {...fieldProps} variant="outlined" />;
      }

      return <FieldEdit {...fieldProps} />;

    case "view":
      return <FieldView {...fieldProps} />;
  }
}

Field.propTypes = {
  mode: PropTypes.oneOf(["edit", "view"]).isRequired
};

export default Field;
