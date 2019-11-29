import _ from 'lodash';
import { createSelector } from 'reselect';

export default createSelector(
  state => state.firestore.data.permissions,
  permissions =>
    permissions &&
    _(permissions)
      .filter(permission => permission && permission.type === 'record-edit')
      .value()
);
