import React, { useState, useCallback } from "react";
import _ from 'lodash';
import { compose, withState } from "recompose";
import cn from "classnames";
import {
  connectRefinementList,
  connectRange,
  connectToggleRefinement
} from "react-instantsearch-dom";
import { withStyles, Badge, Divider } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { DatePicker, DateTimePicker, TimePicker } from "@material-ui/pickers";
import Drawer from "@material-ui/core/Drawer";
import Button from '@material-ui/core/Button';

import FilterValue from "containers/FilterValue";
import FilterDialogOpener from '../FilterDialogOpener';
import FilterDialog from '../FilterDialog';
import useDialog from '../../hooks/useDialog';
import useRouteParams from "../../hooks/useRouteParams";
import { Router } from "../../routes";

const styles = theme => ({
  root: {
    overflow: "auto",
    height: "100%"
  },
  subheader: {
    borderRadius: "8px 8px 0 0",
    backgroundColor: "white"
  },
  subheaderTitle: {
    marginTop: theme.spacing(1),
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
    borderRadius: "0 0 8px 8px",
    overflowX: "auto",
    flexGrow: 1
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
    },
    "& .ais-Highlight-highlighted": {
      fontStyle: "normal",
      backgroundColor: "yellow"
    }
  },
  selectedTableRow: {
    "& td": {
      backgroundColor: theme.palette.grey[200]
    }
  },
  emptyTableRow: {
    "& th": {
      borderBottom: "none"
    }
  },
  idCell: {
    textTransform: "uppercase",
    color: theme.palette.grey[600]
  },
  filter: {
    padding: theme.spacing(1)
  },
  filterHead: {
    padding: 0,
    paddingLeft: theme.spacing(2)
  },
  filterItem: {
    padding: 0,
    paddingLeft: theme.spacing(1)
  },
  badge: {
    position: "static",
    "& span": {
      position: "static",
      backgroundColor: theme.palette.grey[200],
      marginTop: 20,
      marginRight: theme.spacing(2)
    }
  },
  numberFilter: {
    padding: theme.spacing(2)
  }
});

const NumberFilter = compose(
  connectRange,
  withState("open", "setOpen", false),
  withState("minString", "setMinString"),
  withState("maxString", "setMaxString")
)(
  ({
    field,
    open,
    setOpen,
    classes,
    currentRefinement,
    min,
    max,
    minString,
    maxString,
    setMinString,
    setMaxString,
    refine,
    state
  }) => {
    const isOpen = open || (state && (!!state.min || !!state.max));
   
    return (
      <>
        <Divider light />
        <ListItem
          button
          dense
          onClick={e => {
            setOpen(!isOpen);
            refine({});
          }}
          className={classes.filterHead}
        >
          <ListItemText>{field.name}</ListItemText>
          <Checkbox checked={!!isOpen} />
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Divider light />
          <Grid container spacing={3} className={classes.numberFilter}>
            <Grid item xs={6}>
              <TextField
                label="From"
                padding="dense"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={_.isUndefined(minString) ? (currentRefinement.min || (state && state.min)) : minString}
                onChange={e => {
                  setMinString(e.target.value);

                  const value = parseInt(e.target.value) || 0;

                  refine({ ...currentRefinement, min: Math.max(value, min || 0) });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="To"
                padding="dense"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={_.isUndefined(maxString) ? (currentRefinement.max || (state && state.max)) : maxString}
                onChange={e => {
                  setMaxString(e.target.value);

                  const value = parseInt(e.target.value) || 0;

                  refine({ ...currentRefinement, max: Math.min(value, max || 0) });
                }}
              />
            </Grid>
          </Grid>
        </Collapse>
      </>
    );
  }
);

const DateFilter = compose(
  connectRange,
  withState("open", "setOpen", false)
)(({ field, open, setOpen, classes, currentRefinement, min, max, refine, state }) => {
  const isOpen = open || (state && (!!state.min || !!state.max));
  const minDate = ((min && new Date(min)) || state && state.min && new Date(state.min)) || null;
  const maxDate = ((max && new Date(max)) || state && state.max && new Date(state.max)) || null;

  return (
    <>
      <Divider light />
      <ListItem
        button
        dense
        onClick={e => {
          setOpen(!isOpen);
          refine({});
        }}
        className={classes.filterHead}
      >
        <ListItemText>{field.name}</ListItemText>
        <Checkbox checked={!!isOpen} />
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Divider light />
        <Grid container spacing={3} className={classes.numberFilter}>
          <Grid item xs={6}>
            <DatePicker
              label="From"
              padding="dense"
              fullWidth
              autoOk
              clearable
              InputLabelProps={{ shrink: true }}
              minDate={minDate}
              maxDate={maxDate}
              value={((currentRefinement.min && new Date(currentRefinement.min)) || (state && state.min && new Date(state.min))) || null}
              onChange={value =>
                refine({ ...currentRefinement, min: (value && Number(value)) || undefined })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="To"
              padding="dense"
              fullWidth
              autoOk
              clearable
              InputLabelProps={{ shrink: true }}
              minDate={minDate}
              maxDate={maxDate}
              value={((currentRefinement.max && new Date(currentRefinement.max)) || (state && state.max && new Date(state.max))) || null}
              onChange={value =>
                refine({ ...currentRefinement, max: (value && Number(value)) || undefined })
              }
            />
          </Grid>
        </Grid>
      </Collapse>
    </>
  );
});

const DateTimeFilter = compose(
  connectRange,
  withState("open", "setOpen", false)
)(({ field, open, setOpen, classes, currentRefinement, min, max, refine, state }) => {
  const isOpen = open || (state && (!!state.min || !!state.max));
  const minDate = ((min && new Date(min)) || state && state.min && new Date(state.min)) || null;
  const maxDate = ((max && new Date(max)) || state && state.max && new Date(state.max)) || null;

  return (
    <>
      <Divider light />
      <ListItem
        button
        dense
        onClick={e => {
          setOpen(!isOpen);
          refine({});
        }}
        className={classes.filterHead}
      >
        <ListItemText>{field.name}</ListItemText>
        <Checkbox checked={!!isOpen} />
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Divider light />
        <Grid container spacing={3} className={classes.numberFilter}>
          <Grid item xs={12}>
            <DateTimePicker
              label="From"
              padding="dense"
              fullWidth
              autoOk
              clearable
              ampm={undefined}
              InputLabelProps={{ shrink: true }}
              minDate={minDate}
              maxDate={maxDate}
              value={((currentRefinement.min && new Date(currentRefinement.min)) || (state && state.min && new Date(state.min))) || null}
              onChange={value =>
                refine({ ...currentRefinement, min: (value && Number(value)) || undefined })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <DateTimePicker
              label="To"
              padding="dense"
              fullWidth
              autoOk
              clearable
              ampm={undefined}
              InputLabelProps={{ shrink: true }}
              minDate={minDate}
              maxDate={maxDate}
              value={((currentRefinement.max && new Date(currentRefinement.max)) || (state && state.max && new Date(state.max))) || null}
              onChange={value =>
                refine({ ...currentRefinement, max: (value && Number(value)) || undefined })
              }
            />
          </Grid>
        </Grid>
      </Collapse>
    </>
  );
});

const TimeFilter = compose(
  connectRange,
  withState("open", "setOpen", false)
)(({ field, open, setOpen, classes, currentRefinement, min, max, refine, state }) => {
  const isOpen = open || (state && (!!state.min || !!state.max));
  const minDate = ((min && new Date(min)) || state && state.min && new Date(state.min)) || null;
  const maxDate = ((max && new Date(max)) || state && state.max && new Date(state.max)) || null;

  return (
    <>
      <Divider light />
      <ListItem
        button
        dense
        onClick={e => {
          setOpen(!isOpen);
          refine({});
        }}
        className={classes.filterHead}
      >
        <ListItemText>{field.name}</ListItemText>
        <Checkbox checked={!!isOpen} />
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Divider light />
        <Grid container spacing={3} className={classes.numberFilter}>
          <Grid item xs={6}>
            <TimePicker
              label="From"
              padding="dense"
              fullWidth
              autoOk
              clearable
              ampm={undefined}
              InputLabelProps={{ shrink: true }}
              minDate={minDate}
              maxDate={maxDate}
              value={((currentRefinement.min && new Date(currentRefinement.min)) || (state && state.min && new Date(state.min))) || null}
              onChange={value =>
                refine({ ...currentRefinement, min: (value && Number(value)) || undefined })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              label="To"
              padding="dense"
              fullWidth
              autoOk
              clearable
              ampm={undefined}
              InputLabelProps={{ shrink: true }}
              minDate={minDate}
              maxDate={maxDate}
              value={((currentRefinement.max && new Date(currentRefinement.max)) || (state && state.max && new Date(state.max))) || null}
              onChange={value =>
                refine({ ...currentRefinement, max: (value && Number(value)) || undefined })
              }
            />
          </Grid>
        </Grid>
      </Collapse>
    </>
  );
});

const BooleanFilter = compose(connectToggleRefinement)(
  ({ field, currentRefinement, refine, classes, value }) => {
    const checked = currentRefinement || value;

    return (
      <>
        <Divider light />
        <ListItem
          button
          dense
          onClick={e => {
            refine(!checked);
          }}
          className={classes.filterHead}
        >
          <ListItemText>{field.name}</ListItemText>
          <Checkbox checked={checked} />
        </ListItem>
      </>
    );
  }
);

const Filter = compose(
  connectRefinementList,
  withState("open", "setOpen", false)
)(({ field, items, refine, classes, open, setOpen, state }) => {
  const isOpen = open || !_.isEmpty(state);

  return (
    <Collapse in={items.length > 0} timeout="auto" unmountOnExit>
      <Divider light />
      <ListItem
        button
        dense
        onClick={e => {
          setOpen(!isOpen);
          refine([]);
        }}
        className={classes.filterHead}
      >
        <ListItemText>{field.name}</ListItemText>
        <Checkbox checked={isOpen} />
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Divider light />
        <List dense component="div" disablePadding>
          {items.map(item => (
            <ListItem
              key={item.value}
              button
              dense
              onClick={e => {
                e.preventDefault();

                refine(item.value);
              }}
              className={classes.filterItem}
            >
              <Checkbox checked={item.isRefined || state && state.includes(item.label)} tabIndex={-1} disableRipple />
              <ListItemText>
                <FilterValue field={field} recordId={item.label} />
              </ListItemText>
              <ListItemSecondaryAction>
                <Badge badgeContent={item.count} className={classes.badge}>
                  {""}
                </Badge>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Collapse>
  );
});

function FiltersDrawer({ orderedFilterableFields, className, open, onClose, classes, searchState, onSearchStateChange }) {
  const { openDialog } = useDialog(FilterDialog);
  const [forceInit, setForceInit] = useState(false);
  const { platformId, entityId, view } = useRouteParams();
  const onRestFilterClick = useCallback(() => {
    onSearchStateChange({ hitsPerPage: searchState.hitsPerPage, page: searchState.page })
    setForceInit(!forceInit);
    Router.pushRoute("resources", { platformId, entityId, view });
  }, [platformId, entityId, view, forceInit, searchState])

  return (
    <Drawer variant="temporary" anchor="right" {...{ open, onClose }} keepMounted>
      <List
        className={cn(classes.root, className)}
        disablePadding
        subheader={
          <ListSubheader component="div" className={classes.subheader}>
            <Typography variant="subtitle2" className={classes.subheaderTitle}>Filter</Typography>
            <FilterDialogOpener onFilterDrawerClose={onClose} {...{ openDialog, searchState }} />
            <Button 
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={onRestFilterClick}
            >
              Reset filter
            </Button>
          </ListSubheader>
        }
      >

        {orderedFilterableFields.map((field, index) => {
          const props = {
            key: field.id + forceInit,
            attribute: field.id,
            index,
            field,
            classes,
          };
          
          switch (field.type && field.type.type) {
            case "number":
              return <NumberFilter state={_.get(searchState, ['range', field.id], null)} {...props} />;
            case "date":
              return <DateFilter state={_.get(searchState, ['range', field.id], null)} {...props} />;
            case "datetime":
              return <DateTimeFilter state={_.get(searchState, ['range', field.id], null)} {...props} />;
            case "time":
              return <TimeFilter state={_.get(searchState, ['range', field.id], null)} {...props} />;
            case "boolean":
              return <BooleanFilter
                label={field.name}
                value={_.get(searchState, ['toggle', field.id], false)}
                {...props}
              />;
            default:
              return <Filter searchable state={_.get(searchState, ['refinementList', field.id], null)} {...props} />;
          }
        })}
      </List>
    </Drawer>
  );
}

export default withStyles(styles)(FiltersDrawer);
