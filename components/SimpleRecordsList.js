import { connectHits } from "react-instantsearch-dom";
import {
  List,
  makeStyles
} from "@material-ui/core";
import useRouteParams from "../hooks/useRouteParams";
import Typography from '@material-ui/core/Typography';
import RecordsListItem from './RecordsListItem';
import React from 'react';

const useStyles = makeStyles({
  listItem: {
    height: "100%"
  },
  listTitle: {
    padding: '0 16px',
    cursor: 'pointer',
  },
});

function SimpleRecordsList(props) {
  const classes = useStyles();
  const { hits, onClickHandler, className, entity, goToDetailedList } = props;
  const routeParams = useRouteParams();
  const { platformId, view } = routeParams;

  return (
    <>
      {
        hits.length > 0 && (
          <>
            <Typography className={classes.listTitle} variant="subtitle1" onClick={() => {
              goToDetailedList(entity);
            }}>
              {entity.pluralName}
            </Typography>
            <List>
              {
                hits.map((hit, index) => (
                  <RecordsListItem
                    key={hit.objectID}
                    {...{ index, onClickHandler, hits, platformId, view }}
                  />
                ))
              }
            </List>
          </>
        )
      }
    </>
  );
}

export default connectHits(SimpleRecordsList);
