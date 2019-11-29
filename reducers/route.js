import actionTypes from "../constants/actionTypes";
import routes from "../routes";

const initialState = {
  params: {},
  query: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ROUTE.CHANGE:
      const match = (action.payload.url && routes.match(action.payload.url)) || {};
      if (!match || !match.route) return state;
      return {
        ...state,
        url: action.payload.url,
        name: match.route.name,
        params: match.params,
        query: match.query
      };
    default:
      return state;
  }
};
