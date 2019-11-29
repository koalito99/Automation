import React, { useCallback } from "react";
import { MenuItem } from "@material-ui/core";

function ActionsSectionItem({ action, popupState, onActionHandler }) {
  const onClick = useCallback(
    e => {
      popupState.close();
      onActionHandler(action)(e);
    },
    [popupState, onActionHandler]
  );

  return <MenuItem {...{ onClick }}>{action.name}</MenuItem>;
}

export default ActionsSectionItem;
