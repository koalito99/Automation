import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";

class EnhancedTableHead extends React.Component {
  render() {
    const { onSelectAllClick, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" style={{ padding: "0 12px", width: "40px" }}>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          <TableCell>Source field</TableCell>
          <TableCell>Direction</TableCell>
          <TableCell align="right">Entity entity</TableCell>
        </TableRow>
      </TableHead>
    );
  }
}

const toolbarStyles = theme => ({
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    cursor: "pointer"
  }
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, entity, sourceType, onDelete, onExpandToggle } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <div className={classes.title}>
          <div>
            <Typography color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          </div>
          <div>
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className={classes.title} onClick={onExpandToggle}>
          <div>
            <Typography color="inherit" variant="subtitle1">
              {sourceType.name}
            </Typography>
          </div>
          <div>
            <Typography color="inherit" variant="subtitle1">
              {entity.name}
            </Typography>
          </div>
        </div>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class EnhancedTable extends React.Component {
  state = {
    selected: [],
    data: [],
    expanded: false
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(() => ({ selected: this.props.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
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

    this.setState({ selected: newSelected });
  };

  handleKeyCheckboxClick = (event, row) => {
    this.props.handleKeyCheckboxClick(row);
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  renderDirectionIcon = direction => {
    return direction === "left" ? (
      <ArrowBack fontSize="large" />
    ) : (
      <ArrowForward fontSize="large" />
    );
  };

  onDelete = () => {
    const { onDelete } = this.props;
    const { selected } = this.state;

    onDelete(selected);

    this.setState({
      selected: []
    });
  };

  onExpandToggle = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  };

  renderFieldName = parts => {
    return parts.map(part => part && part.value).join(" ");
  };

  render() {
    const { classes, data, entity, sourceType } = this.props;
    const { selected, expanded } = this.state;

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          entity={entity}
          sourceType={sourceType}
          onDelete={this.onDelete}
          onExpandToggle={this.onExpandToggle}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            {expanded && (
              <EnhancedTableHead
                numSelected={selected.length}
                onSelectAllClick={this.handleSelectAllClick}
                rowCount={data.length}
              />
            )}
            <TableBody>
              {expanded &&
                data.map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={event => this.handleClick(event, n.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {this.renderFieldName(n.sourceFields)}
                        {n.direction === "right" && (
                          <Checkbox
                            checked={n.key}
                            onChange={event => this.handleKeyCheckboxClick(event, n)}
                          />
                        )}
                      </TableCell>
                      <TableCell>{this.renderDirectionIcon(n.direction)}</TableCell>
                      <TableCell align="right">{this.renderFieldName(n.entityFields)}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(EnhancedTable);
