import _ from "lodash";
import actionTypes from "../constants/actionTypes";

const initialState = {
  visible: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FILTERS.TOGGLE:
      return {
        ...state,
        visible: _.isUndefined(action.payload.visible) ? !state.visible : action.payload.visible
      };
    default:
      return state;
  }
};
