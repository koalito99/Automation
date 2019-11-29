import { Highlight } from "react-instantsearch-dom";
import format from "date-fns/format";

import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import AutoCalculatedListField from '../../components/AutoCalculatedListField';

const formats = {
  date: "dd.MM.yyyy",
  time: "HH:mm",
  datetime: "dd.MM.yyyy HH:mm"
};

export default ({ record, field }) => {
  const { type } = field.type || {};

  if (field.type && field.type.autoCalculate) {
    return <AutoCalculatedListField {...{ record, field }} />;
  }

  if (["date", "time", "datetime"].includes(type)) {
    const value = record[field.id];

    return (value && format(new Date(value.toDate ? value.toDate() : value), formats[type])) || "";
  }

  if (["color"].includes(type)) {
    const value = record[field.id];

    return (value && <Avatar style={{ backgroundColor: value, width: 16, height: 16 }} />) || "";
  }

  if (["multiselect"].includes(type)) {
    const value = record[field.id];

    return (value && value.join(", ")) || "";
  }

  if (["text"].includes(type)) {
    const value = record[field.id];

    return (
      (value &&
        value.split(/\r?\n/).map((s, index) => (
          <Typography variant="body2" gutterBottom={index < value.split(/\r?\n/).length - 1}>
            {s}
          </Typography>
        ))) ||
      ""
    );
  }

  if (record._highlightResult && record._highlightResult[field.id]) {
    return <Highlight hit={record} attribute={field.id} />;
  }

  return record[field.id] || "";
};
