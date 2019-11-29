import _ from "lodash";
import { createSelector } from "reselect";

export default createSelector(
  (state, entityId, id) => _.get(state, ["draft", "errors", entityId, id]),
  errors => errors
);
