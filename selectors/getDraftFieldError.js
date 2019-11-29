import _ from "lodash";
import { createSelector } from "reselect";

export default createSelector(
  (state, entityId, id, fieldId) => _.get(state, ["draft", "errors", entityId, id, fieldId]),
  value => value
);
