import buildResource from 'helpers/buildResource';

export default buildResource('User', {
  searchBy: ({ email }) => email,
  orderBy: ({ email }) => email && email.toLowerCase(),
  schema: [
    {
      type: 'input',
      name: 'email',
      label: 'Email',
      required: true,
      xs: 12,
      sm: 6
    },
    {
      type: 'input',
      name: 'password',
      label: 'Password',
      skipList: true,
      required: true,
      xs: 12,
      sm: 6
    },
    {
      type: 'id',
      name: 'id',
      label: 'ID',
      skipForm: true
    },
  ]
});
