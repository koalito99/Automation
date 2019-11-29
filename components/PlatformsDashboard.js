import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import AddIcon from "@material-ui/icons/Add";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state/index";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CardHeader from "@material-ui/core/CardHeader";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import styled from 'styled-components';

import { withStyles } from "@material-ui/core/styles";
import withPreventDefault from '../helpers/withPreventDefault';
import withPopupClose from '../helpers/withPopupClose';
import useDialog from '../hooks/useDialog';
import PlatformDialog from '../components/PlatformDialog';
import { useDispatch } from 'react-redux';
import { add } from 'actions/platforms';

const StyledCardActionArea = styled(CardActionArea)`
  && {
    max-width: 936px;
    overflow: hidden;
    height: 204px;
    display: block;
    flex-direction: column;
    align-items: normal;
    justify-items: space-between !important;
  }
`;

const styles = theme => ({
  paper: {
    maxWidth: 936,
    margin: "auto"
  },
  card: {
    minHeight: 200,
    width: 296
  },
  grid: {
    maxWidth: 960,
    margin: "0 auto"
  },
  addTile: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: 296,
    minHeight: "200px",
    "& svg": {
      color: theme.palette.primary.main
    },
    "& h6": {
      color: theme.palette.primary.main,
      marginTop: theme.spacing(1)
    }
  },
  cardContent: {
    margin: "0 auto"
  },
  header: {
    minWidth: "100%"
  },
  title: {
    fontSize: "20px",
    lineHeight: "28px",
    marginBottom: theme.spacing.unit
  },
  subheader: {
    fontSize: "14px",
    lineHeight: "20px"
  },
});

const headToPlatformPage = ({ id }) => {
  if (!id) return;
  window.location.assign(`/platforms/${id}`);
};

const Platforms = ({ classes, platforms }) => {
  const { openDialog } = useDialog(PlatformDialog);
  const dispatch = useDispatch();

  return (
    <div>
      <Typography className={classes.paper} variant="subtitle1" gutterBottom>
        Recent projects
      </Typography>
      <Grid container spacing={3} className={classes.grid}>
        <Grid item>
          <Card className={classes.card}>
            <CardActionArea onClick={() => {
              openDialog();
              dispatch(add());
            }} className={classes.addTile}>
              <AddIcon fontSize="large" />
              <Typography variant="subtitle2">Add platform</Typography>
            </CardActionArea>
          </Card>
        </Grid>
        {platforms &&
        platforms.map(platform => (
          <Grid item key={platform.id} onClick={() => headToPlatformPage(platform)}>
            <Card className={classes.card}>
              <StyledCardActionArea className={classes.tile}>
                <CardHeader
                  classes={{
                    root: classes.header,
                    title: classes.title,
                    subheader: classes.subheader
                  }}
                  title={platform.title}
                  action={
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {popupState => (
                        <React.Fragment>
                          <IconButton
                            {...bindTrigger(popupState)}
                            onClick={withPreventDefault(popupState.open)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            {...bindMenu(popupState)}
                            onClose={withPreventDefault(popupState.close)}
                          >
                            <MenuItem onClick={withPopupClose(popupState)(() => {
                              openDialog();
                              dispatch(add({
                                title: platform.title,
                                clone: platform.id
                              }));
                            })}>
                              Clone
                            </MenuItem>
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  }
                />
              </StyledCardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Platforms.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Platforms);
