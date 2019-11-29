import { useMemo } from "react";

function useField(configuration, fieldId) {
  return useMemo(() => configuration.fields.data[fieldId], [fieldId]);
}

export default useField;
