import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import Collapse from "@material-ui/core/Collapse";
import Zoom from "@material-ui/core/Zoom";
import { InstantSearch, Configure } from "react-instantsearch-dom";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import searchClient from "helpers/searchClient";
import useSearchState from "hooks/useSearchState";

import ViewSelector from "containers/ViewSelector";
import ViewRenderer from "containers/ViewRenderer";
import AddButton from "containers/AddButton";
import FiltersToggle from "containers/FiltersToggle";
import FiltersDrawer from "containers/FiltersDrawer";
import IndexingSnackbar from "containers/IndexingSnackbar";
import DrawerToggle from "../DrawerToggle";
import SearchToggle from "../SearchToggle";
import SearchBox from "../SearchBox";
import useRouteParams from "../../hooks/useRouteParams";
import { Router } from "../../routes";
import MergeButton from "./MergeButton";
import MergeDialog from "containers/MergeDialog";
import useDialog from "../../hooks/useDialog";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  filter: {
    width: 300
  }
});

function MasterDetailsView(props) {
  const {
    platformId,
    entityId,
    query,
    refreshResults,
    setIndexing,
    allowSharing,
    auth,
    selected,
    classes,
  } = props;
  const { view } = useRouteParams();

  useEffect(() => {
    if (!view) {
      Router.pushRoute("resources", { ...Router.query, view: "my" });
    }
  }, [view]);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("xs"));
  const {
    searchState,
    facetFilters,
    isSearchVisible,
    setSearchVisible,
    onSearchStateChange
  } = useSearchState({ query, view, allowSharing, auth, entityId, platformId });

  const { openDialog } = useDialog(MergeDialog);
  
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={entityId}
      refresh={refreshResults}
      searchState={searchState}
      onSearchStateChange={onSearchStateChange}
    >
      <>
        <Configure facetFilters={facetFilters} />

        <IndexingSnackbar />

        <Box
          paddingTop={mobile ? 1 : 0}
          paddingLeft={mobile ? 1 : 0}
          paddingRight={mobile ? 1 : 0}
          paddingBottom={1}
        >
          <Grid container spacing={1} alignItems="center">
            <Hidden lgUp>
              <Grid item>
                <DrawerToggle />
              </Grid>
            </Hidden>
            <Grid item xs>
              <ViewSelector {...{ entityId, allowSharing }} />
            </Grid>
            <Zoom in={selected && selected.length > 1}>
              <Grid item>
                <MergeButton {...{ openDialog }} />
              </Grid>
            </Zoom>
            <Zoom in={!isSearchVisible}>
              <Grid item>
                <SearchToggle
                  {...{
                    entityId,
                    onSearchToggle: () => {
                      setSearchVisible(value => !value);
                    }
                  }}
                />
              </Grid>
            </Zoom>
            <Grid item>
              <FiltersToggle {...{ entityId }} />
            </Grid>
            <Grid item>
              <AddButton {...{ entityId }} />
            </Grid>
          </Grid>
        </Box>

        <Collapse in={isSearchVisible} mountOnEnter>
          <SearchBox {...{ isSearchVisible, setSearchVisible }} />
        </Collapse>

        <ViewRenderer {...{ entityId, setIndexing }} />
        <FiltersDrawer
          {...{ entityId }}
          className={classes.filter}
          searchState={searchState}
          onSearchStateChange={onSearchStateChange}
        />
      </>
    </InstantSearch>
  );
}

MasterDetailsView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MasterDetailsView);
