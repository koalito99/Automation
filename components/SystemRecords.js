import React, { useMemo, useState } from "react";
import { Configure, Index, InstantSearch } from "react-instantsearch-dom";
import searchClient from "helpers/searchClient";
import SearchBox from "../components/SearchBox";
import useRouteParams from '../hooks/useRouteParams';
import SystemRecordsList from './SystemRecordsList';
import { STATE_TYPES } from 'blondie-platform-common';

const systemEntities = {
  entity: "entities",
  field: "fields",
  type: "types",
  relation: "relations",
  action: "actions",
  view: "views",
  widget: "widgets",
  validator: "validators",
  permission: "permissions",
  source: "sources"
};

function SystemRecords() {
  const { platformId } = useRouteParams();

  const facetFilters = useMemo(() => {
    return [
      `platform:${platformId}`,
      `state:${STATE_TYPES.ACTIVE}`
    ];
  }, [platformId]);

  const [searchState, onSearchStateChange] = useState({});

  return (
    <div>
      <InstantSearch
        searchClient={searchClient}
        indexName="types"
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
      >
        <>
          <Configure facetFilters={facetFilters} />
          <SearchBox searchVisible={true} />
          {
            Object.keys(systemEntities).map((entitySingular) => (
              <Index key={entitySingular} indexName={systemEntities[entitySingular]}>
                <Configure {...{ facetFilters }} hitsPerPage={20} />
                <SystemRecordsList typeSingular={entitySingular} typePlural={systemEntities[entitySingular]} />
              </Index>
            ))
          }
        </>
      </InstantSearch>
    </div>
  );
}

export default SystemRecords;
