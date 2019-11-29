import _ from "lodash";
import { createSelector } from "reselect";

export default createSelector(
  (state, entityId, id) => _.get(state, ["draft", "drafts", entityId, id]),
  draft => draft
);
