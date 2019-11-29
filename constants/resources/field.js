import _ from "lodash";
import React, { useCallback } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import buildResource from "helpers/buildResource";
import FormattedValue from "components/FormattedValue";
import { Router } from '../../routes';

const relationTypes = [
  { value: "source", label: "Source" },
  { value: "target", label: "Target" }
];
const sortOrderOptions = [
  { value: "none", label: "None" },
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" }
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
          .collection("fields")
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

export default buildResource("Field", {
  searchBy: ({ name }) => name,
  orderBy: ({ entities, entity, name, order }) => [
    _.padStart(order, 10, "0"),
    _.get(entities, [entity && entity.id, "name"], "").toLowerCase(),
    name && name.toLowerCase()
  ],
  groupBy: ({ relationField, relation, entities, entity, relations, ...rest }) => {
    return relationField
      ? `${_.get(relations, [relation && relation.id, "sourceName"], "")} - ${_.get(relations, [relation && relation.id, "targetName"], "")}`
      : _.get(entities, [entity && entity.id, "name"], "");
  },
  schema: [
    {
      type: "select",
      name: "entity",
      label: "Entity",
      options: ({ entities }) => [
        { label: "— None —" },
        ..._(entities)
          .keys()
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
      required: true,
      visible: ({ relationField }) => !relationField,
      skipList: true,
      xs: 6,
      sm: 4
    },
    {
      type: "input",
      name: "name",
      label: "Name",
      required: true,
      xs: 6,
      sm: 2
    },
    {
      type: "input",
      name: "apiName",
      label: "API name",
      xs: 6,
      sm: 2
    },
    {
      type: "input",
      name: "section",
      label: "Section",
      xs: 6,
      sm: 2
    },
    {
      type: "select",
      name: "type",
      label: "Type",
      options: ({ types }) => [
        { label: "— None —" },
        ..._(types)
          .keys()
          .map(value => ({
            label: _.get(types, [value, "name"]),
            value
          }))
          .orderBy("label")
          .value()
      ],
      onChangeMutate: (value, { firestore }) => {
        return (value && firestore.collection("types").doc(value)) || null;
      },
      valueMutate: value => (value ? value.id : ""),
      listView: (value, { types, platformId }) => {
        if (!value) {
          return "";
        }

        const type = types && types[value.id];

        if (!type) {
          return '';
        }

        return (
          <Link onClick={e => {
            e.stopPropagation();
            Router.pushRoute("type", { platformId, id: value.id });
          }}>
            {type.name}
          </Link>
        );
      },
      xs: 12,
      sm: 2
    },
    {
      name: "defaultValue",
      label: "Default value",
      skipList: true,
      xs: 12,
      sm: 2
    },
    {
      type: "boolean",
      name: "relationField",
      label: "Relation field",
      skipList: true,
      xs: 12,
      sm: 2
    },
    {
      type: "select",
      name: "relation",
      label: "Relation",
      options: ({ relations }) => [
        { label: "— None —" },
        ..._(relations)
          .keys()
          .map(value => {
            const order = parseInt(relations[value].order);
            return {
              label: `${relations[value] &&
              relations[value].sourceName} — ${relations[value] &&
              relations[value].targetName}`,
              order: order, // if NaN then this will be at the end of the list
              value
            };
          })
          .orderBy(['order', 'label'])
          .value()
      ],
      onChangeMutate: (value, { firestore }) => {
        return (value && firestore.collection("relations").doc(value)) || null;
      },
      valueMutate: value => (value ? value.id : ""),
      listView: (value, { relations, platformId }) => {
        if (!value) {
          return "";
        }

        const relation = relations && relations[value.id];

        if (!relation) {
          return "";
        }

        return (
          <Link onClick={e => {
            e.stopPropagation();
            Router.pushRoute("relation", { platformId, id: value.id });
          }}>
            {`${relation.sourceName} — ${relation.targetName}`}
          </Link>
        );
      },
      xs: 12,
      sm: 4
    },
    {
      type: "select",
      name: "relationType",
      label: "Relation type",
      options: relationTypes,
      listView: value => {
        return (
          value &&
          relationTypes.find(relationType => relationType.value === value).label
        );
      },
      visible: ({ relation } = {}) => !!relation,
      required: true,
      xs: 12,
      sm: 4,
      skipList: true
    },
    {
      type: "multiselect",
      name: "actions",
      label: "Actions",
      options: ({ actions2: actions }) => {
        return _(actions)
          .keys()
          .filter(key => actions[key].place === "field")
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
      xs: 12,
      sm: 4
    },
    {
      type: "multiselect",
      name: "validators",
      label: "Validators",
      options: ({ validators }) => {
        return _(validators)
          .keys()
          .map(value => ({
            label: validators[value].name,
            value
          }))
          .orderBy("label")
          .value();
      },
      onChangeMutate: (value, { firestore }) => {
        return (
          value &&
          value.map(item => firestore.collection("validators").doc(item))
        );
      },
      valueMutate: value =>
        value && value.map ? value.map(item => item.id) : [],
      listView: (value, { validators }) => {
        if (!value || !validators) {
          return [];
        }

        const filtered = Object.keys(validators).filter(id =>
          value.includes(id)
        );
        return filtered.map(id => validators[id].name);
      },
      skipList: true,
      xs: 12,
      sm: 4
    },
    {
      type: "string",
      name: "prefix",
      label: "Prefix",
      xs: 3,
      sm: 1
    },
    {
      type: "string",
      name: "suffix",
      label: "Suffix",
      xs: 3,
      sm: 1
    },
    {
      type: "number",
      name: "order",
      label: "Order",
      xs: 6,
      sm: 2
    },
    {
      type: "select",
      name: "sortOrder",
      label: "Sort order",
      options: sortOrderOptions,
      listView: value => {
        return (
          value && sortOrderOptions.find(option => option.value === value).label
        );
      },
      required: false,
      xs: 6,
      sm: 2
    },
    {
      type: "number",
      name: "sortIndex",
      label: "Sort index",
      required: false,
      xs: 6,
      sm: 2
    },
    {
      type: "slider",
      min: 1,
      max: 12,
      name: "xs",
      label: "Mobile",
      skipList: true,
      xs: 12,
      sm: 4
    },
    {
      type: "slider",
      min: 1,
      max: 12,
      name: "sm",
      label: "Tablet",
      skipList: true,
      xs: 12,
      sm: 4
    },
    {
      type: "slider",
      min: 1,
      max: 12,
      name: "md",
      label: "Laptop",
      skipList: true,
      xs: 12,
      sm: 4
    },
    {
      type: "slider",
      min: 1,
      max: 12,
      name: "lg",
      label: "Desktop",
      skipList: true,
      xs: 12,
      sm: 4
    },
    {
      type: "slider",
      min: 1,
      max: 12,
      name: "xl",
      label: "Ulta-wide",
      skipList: true,
      xs: 12,
      sm: 4
    },
    {
      type: "boolean",
      name: "visibleInTableView",
      label: "Table",
      listView: checkboxListView,
      skipForm: true,
      xs: 2
    },
    {
      type: "boolean",
      name: "visibleInForm",
      label: "Form",
      listView: checkboxListView,
      skipForm: true,
      xs: 2
    },
    {
      type: "boolean",
      name: "visibleInQuickForm",
      label: "Quick Form",
      listView: checkboxListView,
      skipForm: true,
      xs: 2
    },
    {
      type: "boolean",
      name: "readOnly",
      label: "Read only",
      listView: checkboxListView,
      skipForm: true,
      xs: 2
    },
    {
      type: "boolean",
      name: "visibleInTitle",
      label: "Title",
      listView: checkboxListView,
      skipForm: true,
      xs: 2
    },
    {
      type: "boolean",
      name: "required",
      label: "Required",
      listView: checkboxListView,
      skipForm: true,
      xs: 2
    },
    {
      type: "boolean",
      name: "searchable",
      label: "Searchable",
      listView: checkboxListView,
      skipForm: true,
      xs: 2
    },
    {
      type: "boolean",
      name: "filterable",
      label: "Filterable",
      listView: checkboxListView,
      skipForm: true,
      xs: 2
    },
    {
      type: "id",
      name: "id",
      label: "ID",
      skipForm: true,
      skipList: true
    }
  ],
  stateToProps: state => {
    return {
      entities: state.firestore.ordered.entities || [],
      types: state.firestore.ordered.types || [],
      actions2: state.firestore.data.actions || [],
      validators: state.firestore.ordered.validators || [],
      fields: state.firestore.ordered.fields || []
    };
  }
});
