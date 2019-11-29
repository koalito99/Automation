import _ from "lodash";
import actionTypes from "../constants/actionTypes";

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INDEXING.SET:
      return _.setWith(_.clone(state), action.payload.entityId, action.payload.value, _.clone);
    default:
      return state;
  }
};
