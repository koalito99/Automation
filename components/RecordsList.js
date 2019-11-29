import cn from 'classnames';
import { connectInfiniteHits } from "react-instantsearch-dom";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList } from "react-window";
import {
  Paper,
  List,
  Fade,
  makeStyles
} from "@material-ui/core";
import EmptyState from "./EmptyState";
import useRouteParams from "../hooks/useRouteParams";
import React from 'react';
import RecordsListItem from './RecordsListItem';

const useStyles = makeStyles({
  root: {
    flex: "1 0 auto"
  },
  listItem: {
    height: "100%"
  },
  paper: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  }
});

function RecordsList(props) {
  const classes = useStyles();
  const { hits, hasMore, refine, onClickHandler, className } = props;
  const routeParams = useRouteParams();
  const { platformId, view } = routeParams;

  let itemsLoaded = {};

  const isItemLoaded = index => !!itemsLoaded[index];

  const item = ({ index, style }) => {
    return <RecordsListItem
      {...{ index, style, onClickHandler, hits, platformId, view }}
    />;
  };

  const content = ({ width, height }) => {
    const loadedContent = ({ onItemsRendered, ref }) => (
      <FixedSizeList
        {...{ onItemsRendered, ref, width, height }}
        itemSize={61}
        itemCount={hits.length + (hasMore ? 1 : 0)}
        innerElementType={List}
      >
        {item}
      </FixedSizeList>
    );

    return (
      <Paper style={{ width, height }} className={classes.paper}>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={hits.length + (hasMore ? 1 : 0)}
          loadMoreItems={(startIndex, stopIndex) => {
            if (stopIndex >= hits.length - 1) {
              refine();
            }
          }}
        >
          {loadedContent}
        </InfiniteLoader>
      </Paper>
    );
  };

  return (
    <div className={cn(classes.root, className)}>
      <Fade in={hits.length === 0}>
        <div>
          <EmptyState
            image={require("../assets/illustrations/followme2.svg")}
            title={`There is nothing here yet...`}
            description={`You can add one by clicking "Add new" at the top.`}
            position="absolute"
            ImageProps={{ style: { maxHeight: "30vh" } }}
          />
        </div>
      </Fade>
      <AutoSizer>{content}</AutoSizer>
    </div>
  );
}

export default connectInfiniteHits(RecordsList);
