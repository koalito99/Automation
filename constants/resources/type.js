import React from "react";
import buildResource from "helpers/buildResource";
import Tooltip from "@material-ui/core/Tooltip";
import { Typography } from "@material-ui/core";

const types = [
  { value: "string", label: "String" },
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "float", label: "Float" },
  { value: "json", label: "JSON" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "datetime", label: "Date & Time" },
  { value: "select", label: "Select" },
  { value: "multiselect", label: "Multi-select" },
  { value: "color", label: "Color" },
  { value: "entity", label: "Entity" },
  { value: "options", label: "Options" },
];

export default buildResource("Type", {
  searchBy: ({ name }) => name,
  orderBy: ({ name }) => name && name.toLowerCase(),
  schema: [
    {
      type: "input",
      name: "name",
      label: "Name",
      required: true,
      xs: 12,
      sm: 6
    },
    {
      type: "select",
      name: "type",
      label: "Base type",
      options: types,
      listView: value => {
        return types.find(type => type.value === value).label;
      },
      required: true,
      xs: 12,
      sm: 6
    },
    {
      type: "string",
      name: "options",
      label: "Options",
      onChangeMutate: value => {
        return value && _.map(value.split(","), s => _.trim(s));
      },
      valueMutate: value => (value ? value.join(", ") : ""),
      listView: value => {
        if (!value) return;

        if (value.length > 3) {
          return (
            <Tooltip title={value.join(", ")} placement="bottom-start">
              <Typography>
                {_.take(value, 3).join(", ")} + {value.length - 3} more
              </Typography>
            </Tooltip>
          );
        }

        return value.join(", ");
      },
      visible: ({ type }) => ["select", "multiselect"].includes(type),
      xs: 12
    },
    {
      type: "code",
      name: "autoIncrement",
      label: "Auto-incrementing",
      skipList: true,
      xs: 12
    },
    {
      type: "code",
      name: "autoGenerate",
      label: "Auto-generate",
      skipList: true,
      xs: 12
    },
    {
      type: "code",
      name: "autoCalculate",
      label: "Auto-calculate",
      skipList: true,
      xs: 12
    },
    {
      type: "code",
      name: "filters",
      label: "Filters",
      skipList: true,
      xs: 12,
    },
    {
      type: "id",
      name: "id",
      label: "ID",
      skipForm: true
    }
  ]
});
