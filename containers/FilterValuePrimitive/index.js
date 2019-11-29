import format from "date-fns/format";

const formats = {
  date: "dd.MM.yyyy",
  time: "HH:mm",
  datetime: "dd.MM.yyyy HH:mm"
};

export default ({ field, recordId: value }) => {
  const { type } = field;

  if (["date", "time", "datetime"].includes(type)) {
    return (value && format(new Date(value.toDate ? value.toDate() : +value), formats[type])) || "";
  }

  return value;
};
