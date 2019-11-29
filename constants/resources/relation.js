import _ from "lodash";
import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import buildResource from "helpers/buildResource";

const relationTypes = [
  { value: "one", label: "Single" },
  { value: "many", label: "Multiple" }
];

function checkboxListView(value, { name, id, firestore }) {
  return (
    <Checkbox
      checked={!!value}
      indeterminate={_.isUndefined(value)}
      value={true}
      onChange={(e, checked) => {
        e.preventDefault();
        e.stopPropagation();

        firestore
          .collection("relations")
          .doc(id)
          .update({ [name]: checked });
      }}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    />
  );
}

export default buildResource("Relation", {
  searchBy: ({ name }) => name,
  orderBy: ({ entities, source, sourceType, target, targetType, name, order }) => [
    _.padStart(order, 10, "0"),
    sourceType === "one" ? 0 : 1,
    targetType === "one" ? 0 : 1,
    _.get(entities, [source.id, "name"], "").toLowerCase(),
    _.get(entities, [target.id, "name"], "").toLowerCase(),
    name && name.toLowerCase()
  ],
  schema: [
    {
      type: "multiselect",
      name: "source",
      label: "Source Entity",
      options: ({ entities }) =>
        _(entities)
          .keys()
          .map(value => ({
            label: entities[value].name,
            value
          }))
          .orderBy("label")
          .value(),
      onChangeMutate: (values, { firestore }) => {
        return values.map((value) => firestore.collection('entities').doc(value));
      },
      valueMutate: values => values ? values.map((value) => value.id) : [],
      listView: (values, { entities }) => {
        if (!values.length || !entities) {
          return "";
        }

        const names = values.map((value) => entities[value.id].name);

        return names.join(', ');
      },
      xs: 12,
      sm: 3,
      required: true
    },
    {
      type: "input",
      name: "sourceName",
      label: "Source Name",
      xs: 12,
      sm: 3,
      required: true
    },
    {
      type: "select",
      name: "sourceType",
      label: "Source Type",
      options: relationTypes,
      listView: value => {
        const relationType = relationTypes.find(
          relationType => relationType.value === value
        );
        return relationType && relationType.label;
      },
      xs: 12,
      sm: 3,
      required: true
    },
    {
      type: "string",
      name: "sourceApiName",
      label: "Source API Name",
      xs: 12,
      sm: 3
    },
    {
      type: "multiselect",
      name: "target",
      label: "Target Entity",
      options: ({ entities }) =>
        _(entities)
          .keys()
          .map(value => ({
            label: entities[value].name,
            value
          }))
          .orderBy("label")
          .value(),
      onChangeMutate: (values, { firestore }) => {
        return values.map((value) => firestore.collection('entities').doc(value));
      },
      valueMutate: values => values ? values.map((value) => value.id) : [],
      listView: (values, { entities }) => {
        if (!values.length || !entities) {
          return "";
        }

        const names = values.map((value) => entities[value.id].name);

        return names.join(', ');
      },
      xs: 12,
      sm: 3,
      required: true
    },
    {
      type: "input",
      name: "targetName",
      label: "Target Name",
      xs: 12,
      sm: 3,
      required: true
    },
    {
      type: "select",
      name: "targetType",
      label: "Target Type",
      options: relationTypes,
      listView: value => {
        const relationType = relationTypes.find(
          relationType => relationType.value === value
        );
        return relationType && relationType.label;
      },
      xs: 12,
      sm: 3,
      required: true
    },
    {
      type: "string",
      name: "targetApiName",
      label: "Target API Name",
      xs: 12,
      sm: 3
    },
    {
      type: "number",
      name: "order",
      label: "Order",
      xs: 12,
      sm: 3
    },
    {
      type: "boolean",
      name: "visible",
      label: "Visible",
      listView: checkboxListView,
      xs: 12
    },
    {
      type: "id",
      name: "id",
      label: "ID",
      skipForm: true
    }
  ]
});
