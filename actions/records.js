import actionTypes from '../constants/actionTypes';

export const setSelectedRecords = selected => ({
  type: actionTypes.RECORDS.SELECT,
  payload: { selected },
});
