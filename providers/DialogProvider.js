import React, { useState, useCallback } from "react";
import DialogContext from "contexts/dialog";

function DialogProvider(props) {
  const [dialogs, setComponents] = useState([]);

  const pushDialog = useCallback((dialog) => {
    setComponents([...dialogs, dialog]);
  }, [dialogs]);

  const popDialog = useCallback(() => {
    dialogs.pop();
    setComponents([...dialogs]);
  }, [dialogs]);

  return (
    <DialogContext.Provider value={{ pushDialog, popDialog }}>
      {React.Children.only(props.children)}
      {
        dialogs.map(([component, props], index) => {
          return (React.createElement(component, { popDialog, key: index, ...props }));
        })
      }
    </DialogContext.Provider>
  );
}

export default DialogProvider;
