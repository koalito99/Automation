import React, { useState, useCallback } from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/styles";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state/index";
import Checkbox from "@material-ui/core/Checkbox";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import withPopupClose from "helpers/withPopupClose";

const useStyles = makeStyles(theme => ({
  paper: {
    margin: "auto"
  },
  searchBar: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    borderRadius: "8px 8px 0 0"
  },
  searchInput: {
    fontSize: theme.typography.fontSize
  },
  block: {
    display: "block"
  },
  addEntity: {
    marginRight: theme.spacing(1)
  },
  contentWrapper: {
    borderRadius: "0 0 8px 8px"
  },
  placeholder: {
    padding: "30px"
  },
  tableRow: {
    cursor: "pointer",
    "& button": {
      visibility: "hidden"
    },
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
      "& button": {
        visibility: "visible"
      }
    },
    "&:last-child th, &:last-child td": {
      borderBottom: "none",
      "&:first-child": {
        borderRadius: "0 0 0 8px"
      },
      "&:last-child": {
        borderRadius: "0 0 8px 0"
      }
    }
  },
  emptyTableRow: {
    "& th": {
      borderBottom: "none"
    }
  },
  formTableRow: {
    "& th": {
      borderBottom: "none",
      backgroundColor: "#eaeff1"
    }
  },
  inlineEditor: {
    margin: "-10px -30px",
    padding: "20px",
    position: "relative"
  },
  inlineEditorForm: {
    display: "flex"
  },
  panels: {
    margin: "0 -30px -10px -30px",
    paddingTop: "30px",
    backgroundColor: "#eaeff1"
  },
  topPanels: {
    margin: "-10px -30px 0 -30px",
    paddingBottom: "30px",
    backgroundColor: "#eaeff1"
  },
  actions: {
    textAlign: "right",
    marginTop: theme.spacing(2),
    "& > *": {
      marginRight: "10px",
      "&:last-child": {
        marginRight: 0
      }
    }
  },
  idCell: {
    textTransform: "uppercase",
    color: theme.palette.grey[600]
  },
  deleteButton: {
    float: "left"
  },
  iframe: {
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    width: "calc(100% + 24px * 2)",
    height: 300,
    margin: "-10px -24px -24px -24px",
    border: "none"
  },
  cell: {
    whiteSpace: "nowrap"
  }
}));

function TableViewRow({
  id,
  selected,
  resource,
  onSave,
  onDelete,
  onCancel,
  onEditHandler,
  onDeleteHandler,
  onSelectHandler,
  entity,
  draft,
  menuItems,
  other
}) {
  const classes = useStyles();
  const onEdit = useCallback(() => {
    if (onEditHandler) {
      onEditHandler(entity);
    }
  }, [entity]);

  const onSelect = event => {
    onSelectHandler(event, entity.id);
  };

  return (
    <TableRow key={entity.id} hover className={classes.tableRow} onClick={onEdit}>
      <TableCell onClick={onSelect} padding="checkbox">
        <Checkbox checked={selected} />
      </TableCell>
      {resource.schema
        .filter(({ skipList }) => !skipList)
        .map(({ name, type, listView }) => (
          <TableCell
            key={name}
            className={name === "id" ? classes.idCell : classes.cell}
            padding={type === "boolean" ? "checkbox" : "default"}
          >
            {listView
              ? listView(entity[name], {
                  ...other,
                  id: entity.id,
                  name
                })
              : entity[name]}
          </TableCell>
        ))}
      <TableCell align="right" padding="checkbox">
        <PopupState variant="popover" popupId={entity.id}>
          {popupState => (
            <>
              <IconButton
                {...bindTrigger(popupState)}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  popupState.open(e);
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu {...bindMenu(popupState)}>
                {onEditHandler && (
                  <MenuItem onClick={withPopupClose(popupState)(onEdit)}>Edit</MenuItem>
                )}
                {menuItems &&
                  Object.keys(menuItems).map(item => (
                    <MenuItem onClick={withPopupClose(popupState)(menuItems[item](entity))}>
                      {item}
                    </MenuItem>
                  ))}
                <MenuItem onClick={withPopupClose(popupState)(onDeleteHandler(entity))}>
                  Delete
                </MenuItem>
              </Menu>
            </>
          )}
        </PopupState>
      </TableCell>
    </TableRow>
  );
}

export default TableViewRow;
