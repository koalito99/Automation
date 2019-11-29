import _ from 'lodash';
import { createSelector } from 'reselect';

export default createSelector(
  (state, props) => state.firestore.ordered[`entities/${props.entityId}/fields`],
  (fields) => (
    _(fields)
      .filter(field => field.visibleInTitle)
      .orderBy(field => parseInt(field.order))
      .value()
  )
);