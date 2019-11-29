import actionTypes from "../constants/actionTypes";

export const setDraft = (entityId, id, draft) => ({
  type: actionTypes.DRAFT.DRAFT_SET,
  payload: { entityId, id, draft }
});

export const setDraftField = (entityId, id, fieldId, value) => ({
  type: actionTypes.DRAFT.DRAFT_FIELD_SET,
  payload: { entityId, id, fieldId, value }
});

export const setErrors = (entityId, id, errors) => ({
  type: actionTypes.DRAFT.ERRORS_SET,
  payload: { entityId, id, errors }
});
