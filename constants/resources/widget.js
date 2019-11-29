import buildResource from "helpers/buildResource";

export default buildResource("Widget", {
  searchBy: ({ name }) => name,
  orderBy: ({ name }) => name && name.toLowerCase(),
  schema: [
    {
      type: "string",
      name: "name",
      label: "Name",
      required: true,
      xs: 12,
      sm: 6
    },
    {
      type: "string",
      name: "title",
      label: "Title",
      required: true,
      xs: 12,
      sm: 6
    },
    {
      type: "code",
      name: "urlGenerator",
      label: "Url",
      required: true,
      skipList: true,
      xs: 12,
      sm: 12
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
      type: "id",
      name: "id",
      label: "ID",
      skipForm: true
    }
  ]
});
