import _ from "lodash";
import { useSelector } from "react-redux";

function useFieldError(entityId, recordId, fieldId) {
  const error = useSelector(state =>
    _.get(state, ["draft", "errors", entityId, recordId, fieldId])
  );

  return [error];
}

export default useFieldError;
