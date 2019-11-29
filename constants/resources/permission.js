import buildResource from 'helpers/buildResource';

const types = [
  { value: 'resource', label: 'View resources' },
  { value: 'field', label: 'See fields' },
  { value: 'record-create', label: 'Create records' },
  { value: 'record-edit', label: 'Edit records' },
  { value: 'record-delete', label: 'Delete records' },
  { value: 'record-sharing', label: 'Share records' }
];

export default buildResource('Permission', {
  searchBy: ({ name }) => name,
  orderBy: ({ name }) => name && name.toLowerCase(),
  schema: [
    {
      type: 'input',
      name: 'name',
      label: 'Name',
      required: true,
      xs: 12,
      sm: 6
    },
    {
      type: 'select',
      name: 'type',
      label: 'Relates to',
      options: types,
      listView: value => {
        const type = types.find(type => type.value === value);
        return _.get(type, 'label');
      },
      required: true,
      xs: 12,
      sm: 6
    },
    {
      type: 'code',
      name: 'rule',
      label: 'Rule',
      skipList: true,
      xs: 12
    },
    {
      type: 'id',
      name: 'id',
      label: 'ID',
      skipForm: true
    }
  ]
});
