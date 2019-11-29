import React, { useMemo } from "react";
import PropTypes from "prop-types";
import useConfiguration from "hooks/useConfiguration";
import useField from "hooks/useField";
import FIELD_TYPES from "../constants/fieldTypes";

import FieldEditString from "./FieldEditString";
import FieldEditText from "./FieldEditText";
import FieldEditSelect from "./FieldEditSelect";
import FieldEditColor from "./FieldEditColor";
import FieldEditIcon from "./FieldEditIcon";
import FieldEditDate from "./FieldEditDate";
import FieldEditTime from "./FieldEditTime";
import FieldEditDateTime from "./FieldEditDateTime";
import FieldEditCheckbox from "./FieldEditCheckbox";
import FieldEditLookup from "./FieldEditLookup";
import FieldEditOptions from './FieldEditOptions';

function FieldEdit(props) {
  const { entityId, fieldId, recordId } = props;

  const configuration = useConfiguration();
  const field = configuration.fields.data[fieldId];
  const { name: label, required, type, relation } = useField(configuration, fieldId);
  const { type: baseType, options } = type || {};
  const defaultProps = { label, required, ...props };

  return useMemo(() => {
    if (field.entity && relation) {
      return <FieldEditLookup {...defaultProps} />;
    }

    if (options) {
      return <FieldEditSelect {...{ options }} {...defaultProps} />;
    }

    switch (baseType) {
      case FIELD_TYPES.DATE:
        return <FieldEditDate {...defaultProps} />;

      case FIELD_TYPES.TIME:
        return <FieldEditTime {...defaultProps} />;

      case FIELD_TYPES.DATE_TIME:
        return <FieldEditDateTime {...defaultProps} />;

      case FIELD_TYPES.ICON:
        return <FieldEditIcon {...defaultProps} />;

      case FIELD_TYPES.COLOR:
        return <FieldEditColor {...defaultProps} />;

      case FIELD_TYPES.BOOLEAN:
        return <FieldEditCheckbox {...defaultProps} />;

      case FIELD_TYPES.TEXT:
        return <FieldEditText {...defaultProps} />;

      case FIELD_TYPES.OPTIONS:
        return <FieldEditOptions {...defaultProps} />;

      default:
        return <FieldEditString {...defaultProps} />;
    }
  }, [entityId, fieldId, recordId]);
}

FieldEdit.propTypes = {
  entityId: PropTypes.string.isRequired,
  fieldId: PropTypes.string.isRequired,
  recordId: PropTypes.string.isRequired
};

export default FieldEdit;
