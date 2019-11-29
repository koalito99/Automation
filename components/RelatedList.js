import React, { useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LinkIcon from "@material-ui/icons/Link";
import AddIcon from "@material-ui/icons/Add";
import PopupState, { bindMenu } from "material-ui-popup-state";
import Icon from "components/Icon";
import RelatedListDetails from "containers/RelatedListDetails";
import FormDialog from "components/FormDialog";
import LookupDialog from "containers/LookupDialog";
import RecordListFileUploadDropzone from "containers/RecordListFileUploadDropzone";
import Visible from "components/Visible";

const styles = theme => ({
  root: {
    width: "100%"
  },
  icon: {
    position: "relative",
    top: 1
  },
  menuIcon: {
    marginRight: 10
  },
  details: {
    padding: 0
  }
});

const RelatedList = ({
  configuration,
  relationEntities,
  id,
  relationName,
  expanded,
  setExpanded,
  lookupDialogOpen,
  onLookupDialogClose,
  formDialogOpen,
  formDialogRecordId,
  formDialogEntityId,
  onFormDialogClose,
  onAssignClick,
  onLookupSelected,
  onUnlinkHandler,
  onEditHandler,
  onDeleteHandler,
  classes,
  relation,
  ...rest
  }) => {
  const onNewClick = useCallback(onEditHandler(relationEntities[0].id), []);

  const popupContent = useCallback(popupState => {
    const onClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      popupState.open(e);
    };

    const onMenuItemClick = (entityId) => (e) => {
      onEditHandler(entityId)(e);
      popupState.close();
    }

      return (
        <>
          <IconButton onClick={onClick}>
            <AddIcon />
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            {
              relationEntities.map((entity) => (
                  <MenuItem onClick={onMenuItemClick(entity.id)}>
                    <Icon name={entity.icon} color={entity.color} className={classes.menuIcon} />
                    {entity.name}
                  </MenuItem>
                )
              )
            }
          </Menu>
        </>
      );
    },
    []
  );

  return (
    <Visible on={relation.visible}>
      <LookupDialog
        open={lookupDialogOpen}
        onClose={onLookupDialogClose}
        entities={relationEntities}
        onClickHandler={onLookupSelected}
      />
      <FormDialog
        open={formDialogOpen}
        onClose={onFormDialogClose}
        entityId={formDialogEntityId}
        recordId={formDialogRecordId}
        relationId={relation.id}
        parentRecordId={id}
        onSubmit={onFormDialogClose}
      />
      <ExpansionPanel
        expanded={expanded}
        onChange={(e, expanded) => setExpanded(expanded)}
        className={classes.root}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container alignItems="center" alignContent="center" spacing={1}>
            {
              relationEntities.length === 1 && <Grid item>
                <Icon name={relationEntities[0].icon} color={relationEntities[0].color} className={classes.icon} />
              </Grid>
            }
            <Grid item xs>
              <Typography variant="body1">{relationName}</Typography>
            </Grid>
            <Grid item>
              <Fade in={expanded}>
                <IconButton color="primary" size="small" onClick={onAssignClick}>
                  <LinkIcon />
                </IconButton>
              </Fade>
            </Grid>
            <Grid item>
              <Fade in={expanded}>
                {
                  relationEntities.length === 1
                    ? <IconButton color="primary" size="small" onClick={onNewClick}>
                      <AddIcon />
                    </IconButton>
                    : <PopupState variant="popover" popupId={relation.id}>
                      {popupContent}
                    </PopupState>
                }
              </Fade>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        {expanded && (
          <ExpansionPanelDetails expanded={expanded} className={classes.details}>
            <RecordListFileUploadDropzone relation={relation}>
              <RelatedListDetails
                {...{ relation, onUnlinkHandler, onEditHandler, onDeleteHandler }}
                {...rest}
              />
            </RecordListFileUploadDropzone>
          </ExpansionPanelDetails>
        )}
      </ExpansionPanel>
    </Visible>
  );
};

export default withStyles(styles)(RelatedList);
