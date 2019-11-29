import actionTypes from "../constants/actionTypes";

export const setIndexing = (entityId, value) => ({
  type: actionTypes.INDEXING.SET,
  payload: { entityId, value }
});
