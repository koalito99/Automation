import { compose, branch, withProps, renderComponent } from "recompose";
import FormField from "containers/FormField";
import DisplayField from "containers/DisplayField";

function dateTimeListView(value) {
  const formats = {
    date: "dd.MM.yyyy",
    time: "HH:mm",
    datetime: "dd.MM.yyyy HH:mm"
  };

  return value && format(new Date(value.toDate ? value.toDate() : value), formats[type]);
}

function dateTimeValueMutate(value) {
  return value && (value.toDate ? value.toDate() : value);
}

export default compose(
  withProps(({ field }) => {
    const additionalProps = {};
    const { type } = field.type || {};

    if (["date", "time", "datetime"].includes(type)) {
      additionalProps["listView"] = dateTimeListView;
      additionalProps["valueMutate"] = dateTimeValueMutate;
    }

    return additionalProps;
  }),
  branch(({ mode }) => mode === "edit", renderComponent(FormField))
)(DisplayField);
