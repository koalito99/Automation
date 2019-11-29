import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import FIELD_TYPES from "constants/fieldTypes";

function parseDate(timestamp) {
  if (timestamp.toDate) {
    return timestamp.toDate();
  }

  return timestamp;
}

function FormattedValue(props) {
  const { type, value } = props;

  if (type !== FIELD_TYPES.BOOLEAN && !value) return null;

  switch (type) {
    case FIELD_TYPES.DATE:
      return moment(parseDate(value)).format("DD.MM.YYYY");

    case FIELD_TYPES.TIME:
      return moment(parseDate(value)).format("HH:mm");

    case FIELD_TYPES.DATE_TIME:
      return moment(parseDate(value)).format("DD.MM.YYYY HH:mm");

    case FIELD_TYPES.BOOLEAN:
      return value ? "Yes" : "No";

    case FIELD_TYPES.TEXT:
      const parts = value.split(/\r?\n/);
      const partsLength = parts.length;

      return parts.map((string, index) => (
        <Typography variant="body2" gutterBottom={index < partsLength - 1}>
          {string}
        </Typography>
      ));

    default:
      return value;
  }
}

FormattedValue.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.any
};

export default FormattedValue;
