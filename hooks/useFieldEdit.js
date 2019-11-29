import { useEffect } from "react";
import useConfiguration from "hooks/useConfiguration";
import useField from "hooks/useField";
import useFieldValue from "hooks/useFieldValue";
import useFieldError from "hooks/useFieldError";
import useFieldCalculation from "hooks/useFieldCalculation";

function useFieldEdit(entityId, recordId, fieldId, defaultValue) {
  const configuration = useConfiguration();
  const { type = {} } = useField(configuration, fieldId);
  const [fieldValue, setFieldValue] = useFieldValue(entityId, recordId, fieldId, defaultValue);
  const [fieldError] = useFieldError(entityId, recordId, fieldId);
  const calculation = useFieldCalculation(entityId, recordId, fieldId);

  const value = fieldValue || (calculation && calculation.value) || "";

  useEffect(() => {
    if (calculation && calculation.value) {
      setFieldValue(calculation.value);
    }
  }, [calculation]);

  return { value, type, fieldError, calculation, setFieldValue };
}

export default useFieldEdit;
