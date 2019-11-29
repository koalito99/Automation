import actionTypes from "../constants/actionTypes";

const initialState = {
  selected: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECORDS.SELECT:
      return {
        ...state,
        selected: action.payload.selected
      };
    default:
      return state;
  }
};
