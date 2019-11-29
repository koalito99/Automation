import React, { useCallback } from "react";
import { Button, makeStyles, Menu } from "@material-ui/core";
import ActionsSectionItem from './ActionsSectionItem';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state/index';

const useStyles = makeStyles({
  button: {
    color: "white"
  }
});

function ActionsSection({ section, actions, onActionHandler }) {
  const classes = useStyles();

  const children = useCallback(
    popupState => (
      <React.Fragment>
        <Button className={classes.button} {...bindTrigger(popupState)}>
          {section}
        </Button>
        <Menu {...bindMenu(popupState)}>
          {actions.map(action => (
            <ActionsSectionItem key={action.id} {...{ action, popupState, onActionHandler }} />
          ))}
        </Menu>
      </React.Fragment>
    ),
    [onActionHandler]
  );

  return (
    <PopupState variant="popover" popupId={section}>
      {children}
    </PopupState>
  );
}

export default ActionsSection;
