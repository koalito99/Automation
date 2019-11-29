import _ from "lodash";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDraftField } from "actions/draft";

function useFieldValue(entityId, recordId, fieldId, defaultValue = "") {
  const dispatch = useDispatch();
  let value = useSelector(state => _.get(state, ["draft", "drafts", entityId, recordId, fieldId]));
  if (!value) value = defaultValue;
  const setValue = useCallback(
    value => dispatch(setDraftField(entityId, recordId, fieldId, value)),
    [dispatch]
  );

  return [value, setValue];
}

export default useFieldValue;
