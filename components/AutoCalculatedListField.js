import React, { useEffect, useState } from 'react';
import * as dateFns from "date-fns";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RecordContext, runCode } from 'blondie-platform-common';
import useFirestore from '../hooks/useFirestore';

function AutoCalculatedListField(props) {
  const [loading, setLoading] = useState(false);
  const [calculatedValue, setCalculatedValue] = useState();
  const firestore = useFirestore();
  const { field, record } = props;
  const { type } = field;
  const entityId = record.entity;

  useEffect(() => {
    const fn = async () => {
      setLoading(true);

      const result = await runCode(type.autoCalculate || type.autoGenerate || type.autoIncrement, {
        this: new RecordContext({ entityId, recordId: record.id, record, firestore }),
        counter: type.autoIncrementCurrent || type.autoIncrementStartAt || 1
      });

      let formattedResult;

      switch (true) {
        case result instanceof Date:
          formattedResult = dateFns.format(result, "dd.MM.yyyy HH:mm");
          break;
        default:
          formattedResult = result;
          break;
      }

      setCalculatedValue(formattedResult);
      setLoading(false);
    };

    fn();
  }, [record]);

  return (
    <>
      {
        loading
          ? <CircularProgress size={18} />
          : <span>{calculatedValue && calculatedValue.toString()}</span>
      }
    </>
  );
}

export default AutoCalculatedListField;
