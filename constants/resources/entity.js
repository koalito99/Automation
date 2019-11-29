import _ from "lodash";
import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import buildResource from "helpers/buildResource";

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
          .collection("entities")
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

export function orderBy({ order }) {
  return Number(order || -1);
}

export default buildResource("Entity", {
  searchBy: ({ name }) => name,
  orderBy,
  schema: [
    {
      type: "input",
      name: "name",
      label: "Singular Name",
      required: true,
      xs: 12,
      sm: true
    },
    {
      type: "input",
      name: "pluralName",
      label: "Plural Name",
      required: true,
      xs: 12,
      sm: true
    },
    {
      type: "input",
      name: "section",
      label: "Section",
      xs: 12,
      sm: true
    },
    {
      type: "input",
      name: "order",
      label: "Order",
      xs: true
    },
    {
      type: "select",
      name: "baseEntity",
      label: "Base entity",
      options: ({ entities, id }) => [
        { label: "— None —", value: null },
        ..._(entities)
          .keys()
          .reject(id)
          .map(value => ({
            label: entities[value].name,
            value
          }))
          .orderBy("label")
          .value()
      ],
      onChangeMutate: (value, { firestore }) => {
        return (value && firestore.collection("entities").doc(value)) || null;
      },
      valueMutate: value => (value ? value.id : ""),
      listView: (value, { entities }) => {
        if (!value) {
          return "";
        }

        const entity = entities[value.id];
        return entity && entity.name;
      },
      xs: 12,
      sm: true
    },
    {
      type: "multiselect",
      name: "actions",
      label: "Actions",
      options: ({ actions2: actions }) => {
        return _(actions)
          .keys()
          .filter(key => actions[key].place === "entity")
          .map(value => ({
            label: actions[value].name,
            value
          }))
          .orderBy("label")
          .value();
      },
      onChangeMutate: (value, { firestore }) => {
        return (
          value && value.map(item => firestore.collection("actions").doc(item))
        );
      },
      valueMutate: value =>
        value && value.map ? value.map(item => item.id) : [],
      listView: (value, { actions2: actions }) => {
        if (!value || !actions) {
          return [];
        }

        const filtered = Object.keys(actions).filter(id => value.includes(id));
        return filtered.map(id => actions[id].name);
      },
      skipList: true,
      xs: 12
    },
    {
      type: "multiselect",
      name: "widgets",
      label: "Widgets",
      options: ({ widgets }) => {
        return _(widgets)
          .keys()
          .map(value => ({
            label: widgets[value].name,
            value
          }))
          .orderBy("label")
          .value();
      },
      onChangeMutate: (value, { firestore }) => {
        return (
          value && value.map(item => firestore.collection("widgets").doc(item))
        );
      },
      valueMutate: value =>
        value && value.map ? value.map(item => item.id) : [],
      listView: (value, { widgets }) => {
        if (!value || !widgets) {
          return [];
        }

        const filtered = Object.keys(widgets).filter(id => value.includes(id));
        return filtered.map(id => widgets[id].name);
      },
      skipList: true,
      xs: 12
    },
    {
      type: "icon",
      name: "icon",
      label: "Icon",
      xs: 12,
      sm: true
    },
    {
      type: "color",
      name: "color",
      label: "Color",
      xs: 12,
      sm: true
    },
    {
      type: "code",
      name: "primary",
      label: "Primary",
      skipList: true,
      xs: 12
    },
    {
      type: "code",
      name: "secondary",
      label: "Secondary",
      skipList: true,
      xs: 12
    },
    {
      type: "code",
      name: "label",
      label: "Label",
      skipList: true,
      xs: 12
    },
    {
      type: "code",
      name: "labelIcon",
      label: "Label icon",
      skipList: true,
      xs: 12
    },
    {
      type: "code",
      name: "labelColor",
      label: "Label color",
      skipList: true,
      xs: 12
    },
    {
      type: "code",
      name: "labelBackground",
      label: "Label background",
      skipList: true,
      xs: 12
    },
    {
      type: "code",
      name: "labelImage",
      label: "Label image",
      skipList: true,
      xs: 12
    },
    {
      type: "boolean",
      name: "visible",
      label: "Visible",
      listView: checkboxListView,
      xs: 12
    },
    {
      type: "boolean",
      name: "authenticable",
      label: "Authenticable",
      listView: checkboxListView,
      xs: 12
    },
    {
      type: "id",
      name: "id",
      label: "ID",
      skipForm: true
    }
  ],
  stateToProps: state => {
    return {
      actions2: state.firestore.data.actions || {},
      widgets: state.firestore.data.widgets || {}
    };
  }
});
