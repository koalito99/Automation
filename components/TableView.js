import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import SearchIcon from "@material-ui/icons/Search";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ModifyTableItemDialog from "./ModifyTableItemDialog";
import useDialog from "hooks/useDialog";
import TableViewRow from "./TableViewRow";
import TableViewFormRow from "./TableViewFormRow";

const useStyles = makeStyles(theme => ({
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
    borderRadius: "0 0 8px 8px",
    overflow: "scroll"
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
  groupTableRow: {
    height: 36,
    "& td": {
      backgroundColor: theme.palette.grey[100],
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5)
    }
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
  table: {
    "& th": {
      padding: "6px 24px 6px 16px",
      whiteSpace: "nowrap"
    }
  }
}));

const TableView = ({
  route,
  resource,
  id,
  draft = {},
  query,
  items,
  routes,
  setDraft,
  dispatch,
  onAdd,
  onSave,
  onDelete,
  onMassSaveHandler,
  onMassDeleteHandler,
  onDeleteHandler,
  onEditHandler,
  onCancel,
  onSearch,
  menuItems,
  extra,
  ...other
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  const dialog = useDialog(ModifyTableItemDialog);

  const openDialog = useCallback(
    props => {
      dialog.openDialog({
        id,
        draft,
        resource,
        onSave,
        onCancel,
        setSelected,
        onDelete,
        other,
        ...props
      });
    },
    [id, draft, resource, onSave, onCancel, onDelete, other]
  );

  useEffect(() => {
    if (id || route.match(/New$/)) {
      openDialog();
    } else {
      dialog.closeDialog();
    }
  }, [route, id]);

  const onSelectHandler = useCallback(
    (event, id) => {
      event.stopPropagation();
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    },
    [selected]
  );

  const handleSelectAllClick = useCallback(
    event => {
      if (event.target.checked) {
        const newSelecteds = items.map(n => n.id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    },
    [items]
  );

  const handleMassSave = useCallback(event => onMassSaveHandler(event, selected), [selected]);

  const handleMassEditClick = useCallback(() => {
    if (selected.length === 1) {
      return onEditHandler({ id: selected[0] });
    }
    if (id) {
      onCancel();
    }
    openDialog({ selected, onSave: handleMassSave });
  }, [id, selected]);

  const handleMassDelete = useCallback(() => {
    onMassDeleteHandler(selected);
    setSelected([]);
  }, [selected]);

  const rowCount = items ? items.length : 0;

  return (
    <Paper>
      <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SearchIcon className={classes.block} color="inherit" />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Search by name or identificator"
                InputProps={{
                  disableUnderline: true,
                  className: classes.searchInput
                }}
                value={query || ""}
                onChange={e => onSearch(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={classes.addEntity}
                onClick={onAdd}
              >
                Add new
              </Button>
              {selected.length > 0 && (
                <React.Fragment>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.addEntity}
                    onClick={handleMassEditClick}
                  >
                    Edit
                  </Button>
                  <Button color="secondary" onClick={handleMassDelete}>
                    Delete
                  </Button>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < rowCount}
                  checked={selected.length === rowCount}
                  onChange={handleSelectAllClick}
                  inputProps={{ "aria-label": "select all desserts" }}
                />
              </TableCell>
              {resource.schema
                .filter(({ skipList }) => !skipList)
                .map(({ label, name }) => (
                  <TableCell key={name} padding="none">
                    {label}
                  </TableCell>
                ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items && items.length ? (
              resource.groupBy ? (
                (() => {
                  const groupedEntities = _(items)
                    .groupBy(item => resource.groupBy({ ...other, ...item }))
                    .value();

                  return _(groupedEntities)
                    .keys()
                    .sort()
                    .map(entityName => (
                      <React.Fragment key={entityName}>
                        <TableRow className={classes.groupTableRow}>
                          <TableCell colSpan={Object.keys(resource.schema).length + 1}>
                            <Typography variant="subtitle2">{entityName}</Typography>
                          </TableCell>
                        </TableRow>
                        {groupedEntities[entityName].map(entity => (
                          <TableViewRow
                            {...{
                              key: entity.id,
                              selected: selected.includes(entity.id),
                              resource,
                              id,
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
                            }}
                          />
                        ))}
                      </React.Fragment>
                    ))
                    .value();
                })()
              ) : (
                items.map(entity => (
                  <TableViewRow
                    {...{
                      key: entity.id,
                      selected: selected.includes(entity.id),
                      resource,
                      id,
                      onSave,
                      onDelete,
                      onCancel,
                      onEditHandler,
                      onDeleteHandler,
                      onSelectHandler,
                      entity,
                      menuItems,
                      draft,
                      other
                    }}
                  />
                ))
              )
            ) : (
              <TableRow className={classes.emptyTableRow}>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  colSpan={resource.schema.filter(({ skipList }) => !skipList).length + 1}
                >
                  {typeof items === "undefined" ? (
                    <CircularProgress />
                  ) : (
                    <Typography
                      color="textSecondary"
                      align="center"
                      className={classes.placeholder}
                    >
                      There is nothing here yet. Start creating by clicking Add button above.
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {extra && extra()}
      </div>
    </Paper>
  );
};

export default TableView;
