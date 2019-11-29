import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import useViews from '../hooks/useViews';

const styles = theme => ({
  icon: {
    width: 53,
    height: 53
  },
  breadcrumbs: {
    color: theme.palette.primary.contrastText,
    opacity: 0.5
  },
  select: {
    "& *": {
      color: theme.palette.primary.contrastText
    }
  }
});

function ViewSelector(props) {
  const { entity, view, allowSharing, onChange, classes } = props;
  const views = useViews(entity.id);

  return (
    <>
      {/* <Typography variant="subtitle2" className={classes.breadcrumbs}>
        {entity.pluralName}
      </Typography> */}
      <TextField
        select
        value={view || "my"}
        onChange={onChange}
        className={classes.select}
        SelectProps={{ disableUnderline: true }}
      >
        <MenuItem value="my">My {entity.pluralName}</MenuItem>
        {allowSharing && <MenuItem value="all">All {entity.pluralName}</MenuItem>}
        {views.map(view => (
          <MenuItem key={view.id} value={view.id}>
            {view.name}
          </MenuItem>
        ))}
        <MenuItem value="deleted">Recently Deleted {entity.pluralName}</MenuItem>
      </TextField>
    </>
  );
}

export default withStyles(styles)(ViewSelector);
