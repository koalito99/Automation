import React from "react";
import Link from "@material-ui/core/Link";
import _ from "lodash";
import buildResource from "helpers/buildResource";

const types = [
  { value: "link", label: "Link" },
  { value: "blondie-flow-trigger", label: "Blondie Flow Trigger" },
  { value: "google-docs", label: "Google Docs" }
];

const relations = [
  { value: "field", label: "Field" },
  { value: "entity", label: "Entity" },
  { value: "relation", label: "Relation" }
];

const openTypes = [
  { value: "_blank", label: "New window"},
  { value: "_self", label: "Same window"},
]

export default buildResource("Action", {
  searchBy: ({ name }) => name,
  orderBy: ({ name }) => name.toLowerCase(),
  schema: [
    {
      type: "input",
      name: "section",
      label: "Section",
      xs: 12,
      sm: 3
    },
    {
      type: "input",
      name: "name",
      label: "Name",
      xs: 12,
      sm: 3
    },
    {
      type: "select",
      name: "type",
      label: "Action type",
      options: types,
      listView: value => {
        return _.get(types.find(type => type.value === value), "label");
      },
      xs: 12,
      sm: 3
    },
    {
      type: "select",
      name: "target",
      label: "Open type",
      options: openTypes,
      listView: value => _.get(openTypes.find(type => type.value === value), "label"),
      xs: 12,
      sm: 3
    },
    {
      type: "select",
      name: "place",
      label: "Relates to",
      options: relations,
      listView: value => {
        return _.get(
          relations.find(relation => relation.value === value),
          "label"
        );
      },
      xs: 12,
      sm: 3
    },
    {
      type: "google-docs-file",
      name: "googleDocsSource",
      label: "Source file",
      visible: ({ type }) => type === "google-docs",
      listView: value => {
        if (!value) return;

        return (
          <Link
            href={value.url}
            target="_blank"
            onClick={e => e.stopPropagation()}
          >
            {value.name}
          </Link>
        );
      },
      xs: 12,
      sm: 3
    },
    {
      type: "google-docs-folder",
      name: "googleDocsDestination",
      label: "Destination folder",
      listView: value => {
        if (!value) return;

        return (
          <Link
            href={value.url}
            target="_blank"
            onClick={e => e.stopPropagation()}
          >
            {value.name}
          </Link>
        );
      },
      visible: ({ type }) => type === "google-docs",
      xs: 12,
      sm: 3
    },
    {
      type: "code",
      name: "destinationFilenameBuilder",
      label: "Destination Filename",
      skipList: true,
      xs: 12,
      visible: ({ type }) => type === "google-docs"
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
      type: "url",
      name: "url",
      label: "Action URL",
      xs: 12,
      sm: 4,
      visible: ({ type }) => type === "link"
    },
    {
      type: "code",
      name: "flowId",
      label: "Flow ID",
      skipList: true,
      xs: 12,
      visible: ({ type }) => type === "blondie-flow-trigger"
    },
    {
      type: "code",
      name: "flowApiKey",
      label: "Flow API Key",
      skipList: true,
      xs: 12,
      visible: ({ type }) => type === "blondie-flow-trigger"
    },
    {
      type: "code",
      name: "entityType",
      label: "Entity Type",
      skipList: true,
      xs: 12,
      visible: ({ type }) => type === "blondie-flow-trigger"
    },
    {
      type: "code",
      name: "entityId",
      label: "Entity ID",
      skipList: true,
      xs: 12,
      visible: ({ type }) => type === "blondie-flow-trigger"
    },
    {
      type: "code",
      name: "eventName",
      label: "Event Name",
      skipList: true,
      xs: 12,
      visible: ({ type }) => type === "blondie-flow-trigger"
    },
    {
      type: "code",
      name: "payload",
      label: "Payload",
      skipList: true,
      xs: 12,
      visible: ({ type }) => type === "blondie-flow-trigger"
    },
    {
      type: "id",
      name: "id",
      label: "ID",
      skipForm: true
    }    
  ]
});
