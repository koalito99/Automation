import React, { useCallback, useMemo } from "react";
import _ from "lodash";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import useRouteParams from "../hooks/useRouteParams";
import useRecordTitles from "../hooks/useRecordTitles";
import { Router } from "../routes";
import useDialog from '../hooks/useDialog';
import CloneDialog from './CloneDialog';
import useBuildPath from '../hooks/useBuildPath';
import AttributionsDialog from './AttributionsDialog';
import useConfiguration from '../hooks/useConfiguration';

function RelatedListDetailsRecord(props) {
  const { entityId, record, onUnlinkHandler, onEditHandler, onDeleteHandler } = props;
  const { platformId, view } = useRouteParams();
  const titles = useRecordTitles(entityId, record);
  const path = useBuildPath();
  const onListItemClick = useCallback(() => {
    Router.pushRoute("resource", { platformId, entityId, id: record.id, view, path });
  }, [record]);
  const { openDialog } = useDialog(CloneDialog);

  const configuration = useConfiguration();

  const relationFields = useMemo(() => {
    const relationType = record.link.source.id === record.id ? "source" : "target";

    return configuration.fields.filterByFn((field) => !field.entity
      && field.relation
      && field.relation.id === record.link.relation.id
      && field.relationType === relationType
    );
  }, [record]);

  const { openDialog: openAttributionsDialog } = useDialog(AttributionsDialog);

  const onEdit = onEditHandler(entityId, record.id);
  const onUnlink = onUnlinkHandler(record.id);
  const onDelete = onDeleteHandler(record.id);

  const popupContent = useCallback(
    popupState => {
      const onEditClick = e => {
        popupState.close();
        onEdit(e);
      };

      const onAttributionsClick = e => {
        popupState.close();
        openAttributionsDialog({ linkId: record.link.id, fields: relationFields });
      };

      const onUnlinkClick = e => {
        popupState.close();
        onUnlink(e);
      };

      const onCloneClick = e => {
        popupState.close();
        openDialog({ entityId, recordId: record.id });
      };

      const onDeleteClick = e => {
        popupState.close();
        onDelete(e);
      };

      return (
        <>
          <IconButton {...bindTrigger(popupState)}>
            <MoreHorizIcon />
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={onEditClick}>Edit</MenuItem>
            {
              relationFields.length && <MenuItem onClick={onAttributionsClick}>Attributions</MenuItem>
            }
            <MenuItem onClick={onUnlinkClick}>Unlink</MenuItem>
            <MenuItem onClick={onCloneClick}>Clone</MenuItem>
            <MenuItem onClick={onDeleteClick}>Delete</MenuItem>
          </Menu>
        </>
      );
    },
    [record, relationFields]
  );

  return (
    <Collapse in={!_.isEmpty(titles)}>
      <Divider light />
      <ListItem key={record.id} button onClick={onListItemClick}>
        <ListItemText
          primary={typeof titles.primary === "object" ? undefined : titles.primary}
          secondary={typeof titles.secondary === "object" ? undefined : titles.secondary}
        />
        <ListItemSecondaryAction>
          <PopupState variant="popover" popupId={record.id}>
            {popupContent}
          </PopupState>
        </ListItemSecondaryAction>
      </ListItem>
    </Collapse>
  );
}

export default RelatedListDetailsRecord;
