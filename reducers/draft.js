import _ from "lodash";
import actionTypes from "../constants/actionTypes";

const initialState = {
  drafts: {},
  errors: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DRAFT.DRAFT_SET:
      return _.set(
        state,
        ["drafts", action.payload.entityId, action.payload.id],
        action.payload.draft
      );
    case actionTypes.DRAFT.DRAFT_FIELD_SET:
      let newState = _.clone(state);
      _.unset(newState, ["errors", action.payload.entityId, action.payload.id, action.payload.fieldId]);
      return _.setWith(
        newState,
        ["drafts", action.payload.entityId, action.payload.id, action.payload.fieldId],
        action.payload.value,
        _.clone
      );
    case actionTypes.DRAFT.ERRORS_SET:
      return _.set(
        state,
        ["errors", action.payload.entityId, action.payload.id],
        action.payload.errors
      );
    default:
      return state;
  }
};
