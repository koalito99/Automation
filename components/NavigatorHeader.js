import React, { useCallback } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Menu,
  MenuItem,
  Collapse,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import PopupState, { bindToggle, bindMenu } from "material-ui-popup-state";
import useAuth from "../hooks/useAuth";
import usePlatforms from "../hooks/usePlatforms";
import useRouteParams from "../hooks/useRouteParams";
import useSignOut from "../hooks/useSignOut";
import { Router } from "../routes";

const useStyles = makeStyles(theme => ({
  container: {
    background: `${
      theme.palette.primary.main
    } url("${require("../assets/try.svg")}") no-repeat center center`,
    backgroundSize: "cover",
    color: theme.palette.primary.contrastText
  },
  avatar: {
    width: 48,
    height: 48,
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main
  },
  select: {
    "& > div": {
      color: theme.palette.primary.contrastText,
      ...theme.typography.body2
    },
    "& svg": {
      color: theme.palette.primary.contrastText
    }
  },
  icon: {
    minWidth: 36
  }
}));

function NavigatorHeader() {
  const classes = useStyles();
  const auth = useAuth();
  const signOut = useSignOut();
  const platforms = usePlatforms();
  const { platformId } = useRouteParams();

  const popupContent = useCallback(popupState => {
    const onConfiguration = () => {
      Router.pushRoute('admin', { platformId });
    };
    
    const onSignOut = () => {
      signOut();
      popupState.close();
    };

    return (
      <>
        <IconButton color="inherit" {...bindToggle(popupState)}>
          <MoreHorizIcon />
        </IconButton>
        <Menu {...bindMenu(popupState)}>
          <MenuItem dense onClick={onConfiguration}>
            <ListItemIcon className={classes.icon}>
              <SettingsApplicationsIcon />
            </ListItemIcon>
            <ListItemText>
              Configuration
            </ListItemText>
          </MenuItem>
          <MenuItem dense onClick={onSignOut}>
            <ListItemIcon className={classes.icon}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText>
              Sign out
            </ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }, []);

  return (
    <Box padding={2} paddingBottom={1} className={classes.container}>
      <Grid container justify="space-between" alignItems="flex-start">
        <Grid item>
          <Avatar src={auth.photoURL} className={classes.avatar}>
            {auth.photoURL ? undefined : _.upperCase(auth.email[0])}
          </Avatar>
        </Grid>
        <Grid item>
          <PopupState variant="popper" popupId="auth-popup">
            {popupContent}
          </PopupState>
        </Grid>
      </Grid>

      <Typography variant="subtitle2">{auth.displayName || auth.email}</Typography>
      <Collapse in={!!platforms} mountOnEnter>
        <TextField
          select
          fullWidth
          value={platformId}
          InputProps={{ disableUnderline: true }}
          className={classes.select}
          onChange={e => window.location.assign(`/platforms/${e.target.value}`)}
        >
          {platforms &&
            platforms.map(platform => (
              <MenuItem 
                key={platform.id} 
                value={platform.id}
              >
                {platform && platform.title}
              </MenuItem>
            ))}
        </TextField>
      </Collapse>
    </Box>
  );
}

export default NavigatorHeader;
