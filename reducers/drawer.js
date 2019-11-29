import actionTypes from "../constants/actionTypes";

const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DRAWER.TOGGLE:
      return !state;
    case actionTypes.ROUTE.CHANGE:
      return false;
    default:
      return state;
  }
};
