import buildResource from 'helpers/buildResource';

export default buildResource('Validator', {
  searchBy: ({ name }) => name,
  orderBy: ({ name }) => name && name.toLowerCase(),
  schema: [
    {
      type: 'string',
      name: 'name',
      label: 'Name',
      required: true,
      xs: 12,
      sm: 6
    },
    {
      type: 'code',
      name: 'errorGenerator',
      label: 'Error message generator',
      required: true,
      skipList: true,
      xs: 12,
    },
    {
      type: 'id',
      name: 'id',
      label: 'ID',
      skipForm: true
    },
  ]
});
