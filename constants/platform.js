import _ from 'lodash';

export default [
  {
    type: "input",
    name: "title",
    label: "Title",
    required: true,
  },
  {
    type: "select",
    name: "clone",
    label: "Copy settings from",
    options: ({ platforms }) => [
      { label: "— None —" },
      ..._(platforms)
        .map(platform => ({
          label: platform.title,
          value: platform.id,
        }))
        .orderBy("label")
        .value()
    ],
    onChangeMutate: (value, { firestore }) => {
      return (value && firestore.collection("platforms").doc(value)) || null;
    },
    valueMutate: value => (value ? value.id : ""),
    required: false,
  },
];
