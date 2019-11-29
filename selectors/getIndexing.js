import _ from "lodash";

export default (state, entityId) => {
  return _.get(state, ["indexing", entityId]);
};
