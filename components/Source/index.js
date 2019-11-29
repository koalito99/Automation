import React from "react";

import TableView from "containers/TableView";

export default ({
  integration,
  credentials,
  reorderedCredentials,
  onSave,
  onDelete,
  onSortEnd
}) => (
  <TableView
    schema={integration.schema}
    items={reorderedCredentials || _.sortBy(credentials, "order")}
    {...{ onSave, onDelete, onSortEnd }}
  />
);
