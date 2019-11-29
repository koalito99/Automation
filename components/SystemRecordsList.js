import { connectInfiniteHits } from "react-instantsearch-dom";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SystemRecordCard from './SystemRecordCard';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles, Typography } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1)
  },
  grid: {
    marginTop: theme.spacing(1)
  },
  control: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(2)
  }
}));

function SystemRecordsList({ hits, typeSingular, typePlural, hasMore, refineNext }) {
  const classes = useStyles();
  const type = useMemo(() => _.capitalize(typePlural), [typePlural]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [hits]);

  const loadMore = useCallback(() => {
    setLoading(true);
    refineNext();
  }, [refineNext]);

  return (
    <div className={classes.container}>
      {
        hits.length > 0 && <Typography variant="h6">{type}</Typography>
      }
      <Grid container spacing={2} className={classes.grid}>
        {
          hits.map((hit) => {
            return (
              <Grid key={hit.objectID} item xs={12} md={3} lg={2}>
                <SystemRecordCard item={hit} type={typeSingular} />
              </Grid>
            );
          })
        }
      </Grid>
      {
        loading && <div className={classes.control}>
          <CircularProgress color="secondary" />
        </div>
      }
      {
        hasMore && !loading && <div className={classes.control}>
          <Button variant="contained" onClick={loadMore}>
            Load more
          </Button>
        </div>
      }
    </div>
  );
}

export default connectInfiniteHits(SystemRecordsList);
