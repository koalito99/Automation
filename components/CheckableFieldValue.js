import React, { useCallback } from "react";
import { makeStyles, Checkbox } from "@material-ui/core";

import useFieldValue from "../hooks/useFieldValue";
import FieldValue from "containers/FieldValue";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  }
});

function CheckableFieldValue({ entityId, record, field, primaryRecordId }) {
  const classes = useStyles();
  const [fieldValue, setFieldValue] = useFieldValue(
    entityId,
    primaryRecordId,
    field.id
  );

  const onCheck = useCallback(e => {
    if (record[field.id]) setFieldValue(record[field.id]);
  }, [record, field, setFieldValue]);

  return (
    <div className={classes.root} onClick={onCheck}>
      <Checkbox
        checked={!!record[field.id] && fieldValue === record[field.id]}
        disabled={!record[field.id]}
      />
      <FieldValue {...{ field }} record={record} />
    </div>
  );
}

export default CheckableFieldValue;
