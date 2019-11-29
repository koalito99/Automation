import React from "react";
import cn from "classnames";
import { connectSearchBox } from "react-instantsearch-dom";
import { withStyles } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Zoom from "@material-ui/core/Zoom";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import RestoreIcon from "@material-ui/icons/Restore";
import { lighten } from "@material-ui/core/styles/colorManipulator";

const styles = theme => ({
  searchBar: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    zIndex: 1
  },
  searchInput: {
    fontSize: theme.typography.fontSize
  },
  highlight: {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85)
  },
  fab: {
    position: "absolute",
    right: theme.spacing(4),
    top: 20
  }
});

const Search = connectSearchBox(({ refine, currentRefinement, classes }) => (
  <TextField
    fullWidth
    placeholder="Search by name or identificator"
    InputProps={{
      disableUnderline: true,
      className: classes.searchInput
    }}
    value={currentRefinement || ""}
    onChange={e => refine(e.target.value)}
  />
));

function MasterToolbar({
  selected,
  paperless,
  setSelected,
  selectable,
  allowCreate,
  onAdd,
  onDeleteSelected,
  onRestoreSelected,
  view,
  classes
}) {
  return (
    <AppBar
      className={cn(classes.searchBar, { [classes.searchBarPaper]: !paperless })}
      position="static"
      color="default"
      elevation={0}
    >
      <Toolbar
        className={cn(classes.toolbar, {
          [classes.highlight]: selected.length > 0
        })}
      >
        {!selectable || selected.length === 0 ? (
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SearchIcon className={classes.block} color="inherit" />
            </Grid>
            <Grid item xs>
              <Search {...{ classes }} />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} alignItems="center" justify="space-between">
            <Grid item>
              <Typography color="secondary" variant="body2">
                {selected.length} selected
              </Typography>
            </Grid>
            <Grid item>
              {view !== "deleted" ? (
                <Tooltip title="Delete selected">
                  <IconButton
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      onDeleteSelected(selected);
                      setSelected([]);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Restore selected">
                  <IconButton
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      onRestoreSelected(selected);
                      setSelected([]);
                    }}
                  >
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
          </Grid>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(MasterToolbar);
