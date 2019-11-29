import actionTypes from '../constants/actionTypes';

export default url => ({
  type: actionTypes.ROUTE.CHANGE,
  payload: { url },
});
