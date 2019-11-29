import _ from 'lodash';
import actionTypes from 'constants/actionTypes';

const initialState = {
  draft: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PLATFORMS.ADD:
      return _.setWith(state, 'draft', action.payload, _.clone);
    case actionTypes.PLATFORMS.CANCEL:
      return _.setWith(state, 'draft', undefined, _.clone);
    case actionTypes.PLATFORMS.DRAFT_CHANGE:
      return _.setWith(state, ['draft', action.payload.field], action.payload.value, _.clone);
    default:
      return state;
  }
};
