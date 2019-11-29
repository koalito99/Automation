import React from "react";
import Popper from "@material-ui/core/Popper";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state/index";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import withStyles from "@material-ui/core/styles/withStyles";

import Details from "containers/Details";

const styles = theme => ({
  paper: {
    "overflow-y": "auto !important",
    maxWidth: 400,
    maxHeight: 300,
    borderBottom: "1px solid #eee"
  },
  popper: {
    zIndex: 1101
  }
});

function QuickForm(props) {
  const { entityId, id = "new", classes, children, onUnlink, ...params } = props;

  return (
    <PopupState variant="popper" popupId="demo-popup-popper">
      {popupState => (
        <ClickAwayListener
          mouseEvent="onClick"
          onClickAway={
            popupState.isOpen
              ? () => {
                  bindToggle(popupState).onClick();
                }
              : () => {}
          }
        >
          <>
            {React.Children.map(children, child => {
              return React.cloneElement(child, {
                onClick: e => {
                  e.preventDefault();
                  e.stopPropagation();
                  bindToggle(popupState).onClick(e);
                }
              });
            })}
            <Popper
              {...bindPopper(popupState)}
              placement="left"
              className={classes.popper}
              modifiers={{
                flip: {
                  enabled: false
                },
                preventOverflow: {
                  enabled: true,
                  boundariesElement: "viewport"
                }
              }}
            >
              <Details
                quick
                {...{
                  entityId,
                  id,
                  ...params,
                  setIndexing: () => {},
                  onUnlink:
                    onUnlink &&
                    (() => {
                      onUnlink();
                      popupState.close();
                    }),
                  onCancel: bindToggle(popupState).onClick,
                  PaperProps: { className: classes.paper }
                }}
              />
            </Popper>
          </>
        </ClickAwayListener>
      )}
    </PopupState>
  );
}

export default withStyles(styles)(QuickForm);
