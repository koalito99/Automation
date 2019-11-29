import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import TableView from './TableView';

const Fields = (props) => (
  <TableView 
    titles={{
      addButton: 'Add field',
      addTitle: 'Add a new field',
      updateButton: 'Update field',
      updateTitle: 'Update a field',
      empty: 'No fields for this project yet'
    }}
    {...props}
  />
)

export default Fields;