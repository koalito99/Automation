import React, { useCallback, useState, useMemo } from "react";
import { InstantSearch, Configure, Index } from "react-instantsearch-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import { Box, Dialog, DialogContent, DialogTitle, Divider, Fade } from "@material-ui/core";

import RecordsList from "components/RecordsList";
import SearchBox from "components/SearchBox";
import searchClient from "helpers/searchClient";
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SimpleRecordsList from './SimpleRecordsList';

const styles = theme => ({
  dialogContent: {
    padding: 0
  },
  button: {
    color: 'red',
    margin: '0 10px 0 0',
  },
  records: {
    width: "60vw",
    height: "60vh",
  }
});

function LookupDialog(props) {
  const { auth, entities, open = false, allowSharing, onClose, onClickHandler, classes } = props;
  const [detailedEntity, setDetailedEntity] = useState(null);
  const [query, setQuery] = useState('');
  const [searchState, setSearchState] = useState({});
  const [multiIndexSearchState, setMultiIndexSearchState] = useState({});

  const goToDetailedList = useCallback((entity) => {
    setDetailedEntity(entity);
  }, []);

  const goBack = useCallback(() => {
    setDetailedEntity(null);
  }, []);

  const onSearchStateChange = useCallback((searchState) => {
    setQuery(searchState.query || '');
    setSearchState(searchState);
  }, []);

  const onMultiIndexSearchState = useCallback((searchState) => {
    setQuery(searchState.query || '');
    setMultiIndexSearchState(searchState);
  }, []);

  const facetFilters = useMemo(() => {
    return entities.reduce((acc, entity) => {
      acc[entity.id] = ["state:active"];

      if (!allowSharing[entity.id]) {
        acc[entity.id].push(`uid:${auth.uid}`);
      }

      return acc;
    }, {});
  }, [allowSharing]);

  const detailedEntityId = detailedEntity && detailedEntity.id;

  return (
    <Dialog scroll="body" maxWidth="xl" {...{ open, onClose }}>
      <DialogTitle>
        {
          detailedEntity && <IconButton onClick={goBack} className={classes.button}>
            <ArrowBackIcon color="action" />
          </IconButton>
        }
        Lookup
      </DialogTitle>
      <Divider light />
      <DialogContent className={classes.dialogContent}>
        {
          detailedEntityId && <InstantSearch
            key={detailedEntityId}
            indexName={detailedEntityId}
            onSearchStateChange={onSearchStateChange}
            searchClient={searchClient}
            searchState={{ ...searchState, query }}
          >
            <Box padding={2}>
              <SearchBox isSearchVisible variant="standard" InputProps={{}} InputLabelProps={{ shrink: true }} />
            </Box>
            <Configure facetFilters={facetFilters[detailedEntityId]} />
            <RecordsList
              className={classes.records}
              {...{ onClickHandler }}
            />
          </InstantSearch>
        }
        {
          !detailedEntityId && <InstantSearch
            indexName={entities[0].id}
            onSearchStateChange={onMultiIndexSearchState}
            searchClient={searchClient}
            searchState={{ ...multiIndexSearchState, query }}
          >
            <Box padding={2}>
              <SearchBox isSearchVisible variant="standard" InputProps={{}} InputLabelProps={{ shrink: true }} />
            </Box>
            <div className={classes.records}>
              {
                entities.map((entity) => (
                  <Index key={entity.id} indexName={entity.id}>
                    <Configure facetFilters={facetFilters[entity.id]} hitsPerPage={5} />
                    <SimpleRecordsList
                      {...{ onClickHandler, entity, goToDetailedList }}
                    />
                  </Index>
                ))
              }
            </div>
          </InstantSearch>
        }
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(styles)(LookupDialog);
