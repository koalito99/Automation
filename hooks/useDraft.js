import _ from "lodash";
import { useSelector } from "react-redux";

function useDraft(entityId, recordId) {
  return useSelector(state =>
    _.get(state, ["draft", "drafts", entityId, recordId])
  );
}

export default useDraft;
