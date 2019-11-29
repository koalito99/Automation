import actionTypes from "../constants/actionTypes";

export const toggle = visible => ({
  type: actionTypes.FILTERS.TOGGLE,
  payload: { visible }
});
