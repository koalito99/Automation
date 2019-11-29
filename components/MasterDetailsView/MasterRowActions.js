import React from "react";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state/index";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import withPopupClose from "helpers/withPopupClose";

import { STATE_TYPES } from "blondie-platform-common";

class MasterRowActions extends React.Component {
  shouldComponentUpdate({ entity: nextEntity }) {
    const { entity } = this.props;

    return entity !== nextEntity;
  }

  onIconClickHandler = popupState => e => {
    e.preventDefault();
    e.stopPropagation();
    popupState.open(e);
  };

  render() {
    const {
      entity,
      allowEdit,
      allowDelete,
      onEditHandler,
      onDeleteHandler,
      onRestoreHandler,
      onIconClickHandler
    } = this.props;

    if (entity.state !== STATE_TYPES.DELETED && !allowEdit && !allowDelete) {
      return null;
    }

    return (
      <PopupState variant="popover" popupId={entity.objectID}>
        {popupState => (
          <>
            <IconButton {...bindTrigger(popupState)} onClick={this.onIconClickHandler(popupState)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu {...bindMenu(popupState)}>
              {entity.state !== STATE_TYPES.DELETED ? (
                <>
                  {allowEdit && (
                    <MenuItem onClick={withPopupClose(popupState)(onEditHandler(entity))}>
                      Edit
                    </MenuItem>
                  )}
                  {allowDelete && (
                    <MenuItem onClick={withPopupClose(popupState)(onDeleteHandler(entity))}>
                      Delete
                    </MenuItem>
                  )}
                </>
              ) : (
                <MenuItem onClick={withPopupClose(popupState)(onRestoreHandler(entity))}>
                  Restore
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </PopupState>
    );
  }
}

export default MasterRowActions;
