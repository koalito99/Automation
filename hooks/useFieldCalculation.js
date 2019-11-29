import _ from "lodash";
import { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { ReduxFirestoreContext } from "react-redux-firebase";
import { runCode, RecordContext } from "blondie-platform-common";
import useDebounce from "hooks/useDebounce";
import useConfiguration from "hooks/useConfiguration";

function useFieldCalculation(entityId, recordId, fieldId) {
  const firestore = useContext(ReduxFirestoreContext);
  const configuration = useConfiguration();
  const field = configuration.fields.data[fieldId];
  const { type } = field;
  const [calculation, setCalculation] = useState();
  const record = useSelector(state => _.get(state, ["draft", "drafts", entityId, recordId]));
  const currentValue = record && record[fieldId];
  const debouncedRecord = useDebounce(record, 500);

  useEffect(() => {
    const fn = async () => {
      const isNew = recordId === "new";

      if (!record) return;
      if (currentValue) return;
      if (!type) return;
      if (!type.autoIncrement && !type.autoGenerate && !type.autoCalculate) return;
      if (type.autoIncrement && !isNew) return;
      if (type.autoGenerate && currentValue) return;

      setCalculation({ loading: true });

      let result;

      try {
        result = await runCode(type.autoCalculate || type.autoGenerate || type.autoIncrement, {
          this: new RecordContext({
            entityId,
            recordId: isNew ? undefined : recordId,
            record,
            field,
            firestore
          }),
          counter:
            (type.autoIncrementCurrent ? type.autoIncrementCurrent + 1 : null) ||
            type.autoIncrementStartAt ||
            1
        });

        setCalculation({ value: result });
      } catch (e) {
        setCalculation({ error: e });
      }
    };

    fn();
  }, [debouncedRecord]);

  return calculation;
}

export default useFieldCalculation;
