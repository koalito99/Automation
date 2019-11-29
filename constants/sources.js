import React from "react";
import FIELD_TYPES from "./fieldTypes";
import { typeAndFieldsToTypeSchema } from "../helpers/schemaGenerator";
import readFile from "../helpers/fileReader";

import { manifest as MicrosoftDynamicsCrmSource } from "blondie-platform-sources-microsoft-dynamics-crm";
import _ from 'lodash';

function enchanceSchemas(sources) {
  const enhanced = [];

  for (const source of sources) {
    if (source) {
      source.schema = source.schema || [];
      source.schema.unshift({
        type: FIELD_TYPES.STRING,
        name: "name",
        label: "Name",
        required: true
      });
      enhanced.push(source);
    }
  }

  return enhanced;
}

export default enchanceSchemas([
  MicrosoftDynamicsCrmSource,
  {
    type: "google-docs",
    title: "Google Docs",
    description: "Enables Google Docs source.",
    image: require("assets/google-docs.jpg")
  },
  {
    type: "sdk",
    title: "SDK",
    description: "Enables SDK source for external apps integration.",
    image: require("assets/sdk.png"),
    schema: [
      {
        type: FIELD_TYPES.STRING,
        label: "Key",
        name: "key",
        required: true,
        xs: 12
      },
      {
        type: FIELD_TYPES.GRAPHQL_SCHEME,
        label: "Schema",
        name: "schema",
        required: false,
        xs: 12
      }
    ]
  },
  {
    type: "api",
    title: "API",
    description: "Enables API integration for incoming/outgoing requests.",
    image: require("assets/api.jpg")
  },
  {
    type: "call",
    title: "Call",
    description: "Enables integration with VOIP provider for in/out calls.",
    image: require("assets/call.png")
  },
  {
    type: "email",
    title: "Email",
    description: "Enables email integration to receive and send emails.",
    image: require("assets/gmail.jpg")
  },
  {
    type: "flow",
    title: "Flow",
    description: "Enables Flow integration to automate business processes.",
    image: require("assets/platform.png")
  },
  {
    type: "excel",
    title: "Excel",
    description: "Enables Excel integration as a data source.",
    image: require("assets/excel.png")
  },
  {
    type: "csv",
    title: "CSV",
    description: "Enables CSV integration as a data source.",
    image: require("assets/excel.png"),
    importable: true,
    importSchema: [
      {
        type: FIELD_TYPES.CSV_UPLOAD,
        label: "CSV File",
        name: "files",
        required: true,
        xs: 12,
        showFiles: true,
        fileDropText: "Drop CSV to import"
      }
    ],
    schema: [
      {
        type: FIELD_TYPES.CSV_UPLOAD,
        label: "CSV File",
        name: "csv_file",
        required: false,
        fileDropText: "Drop CSV to generate schema",
        showFiles: false,
        xs: 12,
        onChangeHandler: onChangeHandler => {
          return async files => {
            const file = files[0];
            const data = await readFile(file);

            if (!data.length) {
              return;
            }

            const fields = data[0];

            const schemaFieldChangeHandler = onChangeHandler("schema");
            const schema = typeAndFieldsToTypeSchema(fields);

            schemaFieldChangeHandler(schema);
          };
        }
      },
      {
        type: FIELD_TYPES.GRAPHQL_SCHEME,
        label: "Schema",
        name: "schema",
        required: false,
        xs: 12
      }
    ]
  },
  {
    type: "sql",
    title: "SQL",
    description: "Enables SQL database integration as data source.",
    image: require("assets/sql.jpg")
  },
  {
    type: "firestore",
    title: "Firestore",
    description: "Enables Google Firestore integration as data source.",
    image: require("assets/firestore.jpg")
  },
  {
    type: "zoho-crm",
    oauth: true,
    title: "Zoho CRM",
    description: "Enables Zoho CRM based data source.",
    image: require("assets/zoho.jpg")
  },
  {
    type: "sap",
    title: "SAP",
    description: "Enables SAP based data source.",
    image: require("assets/sap.jpg")
  },
  {
    type: "salesforce",
    title: "Salesforce",
    description: "Enables Salesforce based data source.",
    image: require("assets/salesforce.png")
  },
  {
    type: "pipedrive",
    title: "Pipedrive",
    description: "Enables Pipedrive based data source.",
    image: require("assets/pipedrive.jpg")
  },
  {
    type: "telegram",
    title: "Telegram",
    description: "Enables Telegram integration to send and receive messages.",
    image: require("assets/telegram.jpg")
  },
  {
    type: "slack",
    title: "Slack",
    description: "Enables Slack integration to send and receive messages.",
    image: require("assets/slack.png")
  },
  {
    type: "messenger",
    title: "Messenger",
    description: "Enables Facebook Messenger integration for messaging.",
    image: require("assets/messenger.jpg")
  },
  {
    type: "pusher",
    title: "Pusher",
    description: "Enables Pusher integration to send and receive notifications.",
    image: require("assets/pusher.jpg")
  },
  {
    type: "file",
    title: "File",
    description: "Enables File as a data source.",
    image: require("assets/files.png"),
    schema: [
      {
        type: "select",
        name: "entity",
        label: "Entity",
        options: ({ configuration }) => [
          { label: "— None —" },
          ..._(configuration.entities.data)
            .keys()
            .map(value => ({
              label: configuration.entities.data[value].name,
              value
            }))
            .orderBy("label")
            .value()
        ],
        onChangeMutate: (value, { firestore }) => {
          return (value && firestore.collection("entities").doc(value)) || null;
        },
        valueMutate: value => (value ? value.id : ""),
        listView: (value, { configuration }) => {
          if (!value) {
            return "";
          }

          const entity = configuration.entities.data[value.id];

          return entity && entity.name;
        },
        required: true,
        xs: 12
      },
      {
        type: FIELD_TYPES.GRAPHQL_SCHEME,
        label: "Schema",
        name: "schema",
        required: false,
        xs: 12
      }
    ]
  }
]);
