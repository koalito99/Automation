import FIELD_TYPES from './fieldTypes';

export default [
  {
    type: FIELD_TYPES.STRING,
    name: "name",
    label: "Name",
    required: true,
  },
  {
    type: FIELD_TYPES.BOOLEAN,
    name: "visibleOnlyForUser",
    label: "Visible only for me",
  },
];
