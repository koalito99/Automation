import React from 'react';
import { Router } from '../routes';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import Icon from './Icon';
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles({
  root: {},
  listItem: {
    height: "100%"
  },
  listTitle: {
    padding: '0 16px',
    cursor: 'pointer',
  },
  paper: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  }
});

export default function RecordsListItem({ index, style, onClickHandler, hits, platformId, view })  {
  const classes = useStyles();
  const { objectID: id, primary, secondary, labelBackground, labelColor, label, labelIcon, labelImage, entity } =
  hits[index] || {};

  const onClick = onClickHandler
    ? onClickHandler(hits[index])
    : (() => {
      Router.pushRoute("resource", { platformId, entityId: entity, id, view });
    });

  return (
    <ListItem
      button
      divider
      dense
      ContainerProps={{ style }}
      className={classes.listItem}
      onClick={onClick}
    >
      <ListItemAvatar>
        <Avatar src={labelImage} style={{ color: labelColor, backgroundColor: labelBackground }}>
          {labelIcon && <Icon name={labelIcon} color={labelColor} />} {label}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        {...{ primary, secondary }}
      />
      <ListItemSecondaryAction>
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
