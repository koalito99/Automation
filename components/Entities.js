import _ from 'lodash';
import React from 'react';

import TableView from './TableView';

const Entities = (props) => (
  <TableView 
    titles={{
      addButton: 'Add entity',
      addTitle: 'Add a new entity',
      updateButton: 'Update entity',
      updateTitle: 'Update an entity',
      empty: 'No entities for this project yet'
    }}
    routes={{
      show: 'entity'
    }}
    {...props}
  />
)

export default Entities;
