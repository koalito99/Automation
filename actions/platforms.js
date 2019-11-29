import actionTypes from 'constants/actionTypes';

export const add = (payload = {}) => ({
  type: actionTypes.PLATFORMS.ADD,
  payload
});

export const cancel = () => ({
  type: actionTypes.PLATFORMS.CANCEL
})

export const changeDraft = (field, value) => ({
  type: actionTypes.PLATFORMS.DRAFT_CHANGE,
  payload: { field, value }
})
