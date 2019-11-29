import { useState, useEffect, useContext } from "react";
import _ from "lodash";
import { runCode, RecordContext } from "blondie-platform-common";
import { ReduxFirestoreContext } from "react-redux-firebase";
import useEntity from "./useEntity";

export function calculateTitle(value, { entityId, record, firestore }) {
  return runCode(value, {
    this: new RecordContext({
      entityId,
      recordId: record.id,
      record,
      firestore
    })
  });
}

function useRecordTitles(entityId, recordOrId) {
  const firestore = useContext(ReduxFirestoreContext);
  const entity = useEntity(entityId);
  const [titles, setTitles] = useState({});

  useEffect(() => {
    const fn = async () => {
      if (_.isEmpty(recordOrId)) {
        return;
      }
      let record = recordOrId;
      if (!_.isPlainObject(record)) {
        if (recordOrId === "new") {
          return;
        }

        const doc = await firestore
          .collection("records")
          .doc(recordOrId)
          .get();
        record = { ...doc.data(), id: doc.id };
      }

      const [primary, secondary] = await Promise.all([
        calculateTitle(entity.primary, { entityId, record, firestore }).catch(
          console.error
        ),
        calculateTitle(entity.secondary, { entityId, record, firestore }).catch(
          console.error
        )
      ]);

      setTitles({ primary, secondary });
    };

    setTitles({});
    fn();
  }, [recordOrId]);

  return titles;
}

export default useRecordTitles;
