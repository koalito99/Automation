import _ from 'lodash';
import { createSelector } from 'reselect';

export default createSelector(
  (state, props) => props.fields, // state.firestore.ordered[`entities/${props.entityId}/fields`],
  fields =>
    _(fields)
      .filter(field => field.filterable)
      .orderBy(field => parseInt(field.order))
      .value()
);
