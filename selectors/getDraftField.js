import _ from "lodash";

export default (state, entityId, id, fieldId) =>
  _.get(state, ["draft", "drafts", entityId, id, fieldId]);
