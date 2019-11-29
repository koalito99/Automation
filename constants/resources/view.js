import buildResource from 'helpers/buildResource';

const viewTypes = [
  { value: 'table', label: 'Table' },
  { value: 'kanban', label: 'Kanban' }
];

export default buildResource('View', {
  searchBy: ({ name }) => name,
  orderBy: ({ name }) => name && name.toLowerCase(),
  initialDraft: { uid: null },
  schema: [
    {
      type: 'input',
      name: 'name',
      label: 'Name',
      required: true,
      xs: 12,
      sm: 4
    },
    {
      type: 'input',
      name: 'uid',
      label: 'uid',
      required: false,
      skipForm: true,
    },
    {
      type: 'select',
      name: 'entity',
      label: 'Entity',
      options: ({ entities }) => (
        [
          { label: '— None —', value: null },
          ..._(entities)
            .keys()
            .map(value => ({
              label: entities[value].name,
              value
            }))
            .orderBy('label')
            .value()
        ]
      ),
      onChangeMutate: (value, { firestore }) => {
        return value && firestore.collection('entities').doc(value) || null;
      },
      valueMutate: (value) => value ? value.id : '',
      listView: (value, { entities }) => {
        if (!value) {
          return '';
        }

        const entity = entities[value.id];
        return entity && entity.name;
      },
      required: true,
      xs: 12,
      sm: 4
    },
    {
      type: 'select',
      name: 'type',
      label: 'View type',
      options: viewTypes,
      listView: (value) => {
        return value && viewTypes.find((viewType) => viewType.value === value).label;
      },
      required: true,
      xs: 12,
      sm: 4
    },
    {
      type: 'select',
      name: 'groupBy',
      label: 'Group by',
      options: ({ entityFields }) => {
        return (
        [
          { label: '— None —', value: null },
          ..._(entityFields)
            .map(value => ({
              label: value.name,
              value: value.id
            }))
            .orderBy('label')
            .value()
        ]
      )},
      onChangeMutate: (value, { firestore }) => {
        return value && firestore.collection('fields').doc(value) || null;
      },
      valueMutate: (value) => value ? value.id : '',
      listView: (value, { fields }) => {
        if (!value) {
          return '';
        }

        const field = fields && fields[value.id];
        return field && field.name;
      },
      required: true,
      visible: ({ type }) => type === 'kanban',
      xs: 12,
      sm: 3
    },
    {
      type: 'select',
      name: 'primary',
      label: 'Primary field',
      options: ({ entityFields }) => {
        return (
        [
          { label: '— None —', value: null },
          ..._(entityFields)
            .map(value => ({
              label: value.name,
              value: value.id
            }))
            .orderBy('label')
            .value()
        ]
      )},
      onChangeMutate: (value, { firestore }) => {
        return value && firestore.collection('fields').doc(value) || null;
      },
      valueMutate: (value) => value ? value.id : '',
      listView: (value, { fields }) => {
        if (!value) {
          return '';
        }

        const field = fields && fields[value.id];
        return field && field.name;
      },
      required: true,
      visible: ({ type }) => type === 'kanban',
      xs: 12,
      sm: 3
    },
    {
      type: 'select',
      name: 'secondary',
      label: 'Secondary field',
      options: ({ entityFields }) => {
        return (
        [
          { label: '— None —', value: null },
          ..._(entityFields)
            .map(value => ({
              label: value.name,
              value: value.id
            }))
            .orderBy('label')
            .value()
        ]
      )},
      onChangeMutate: (value, { firestore }) => {
        return value && firestore.collection('fields').doc(value) || null;
      },
      valueMutate: (value) => value ? value.id : '',
      listView: (value, { fields }) => {
        if (!value) {
          return '';
        }

        const field = fields && fields[value.id];
        return field && field.name;
      },
      required: true,
      visible: ({ type }) => type === 'kanban',
      xs: 12,
      sm: 3
    },
    {
      type: 'id',
      name: 'id',
      label: 'ID',
      skipForm: true
    },
  ]
});
