import qs from 'qs';
import _ from 'lodash';
import { useEffect, useState, useMemo } from 'react';
import { Router } from '../routes';
import useRouteName from './useRouteName';
import useDebounce from './useDebounce';
import useFirestore from './useFirestore';

const DEBOUNCE_TIME = 700;

const initialSearchState = {
  hitsPerPage: 20,
  page: 1,
};

const urlToSearchState = queryString => {
  const params = qs.parse(queryString.slice(1));

  return castBoolString(params);
};

const castBoolString = (params) => {
  return Object.keys(params).reduce((acc, paramKey) => {
    let value = params[paramKey];

    if (_.isPlainObject(value)) {
      value = castBoolString(value);
    }

    if (value === 'true') {
      value = true;
    }

    if (value === 'false') {
      value = false;
    }

    acc[paramKey] = value;

    return acc;
  }, {});
};

const cleanUp = (obj) => {
  for (const key of Object.keys(obj)) {
    let val = obj[key];

    if (_.isPlainObject(val)) {
      val = cleanUp(val);
    }

    if ((_.isObjectLike(val) && _.isEmpty(val))) {
      delete obj[key];
    }
  }

  return obj;
};

const cleanUpSearchState = (searchState) => {
  let params = {
    ...searchState,
    configure: {
      ...searchState.configure,
      facetFilters: _.get(searchState, 'configure.facetFilters', [])
        .filter((facetProp) => !facetProp.includes('uid:') && !facetProp.includes('state:'))
    }
  };

  for (const key of Object.keys(initialSearchState)) {
    if (params[key] && params[key] === initialSearchState[key]) {
      delete params[key];
    }
  }

  params = cleanUp(params);

  return params;
};

function useSearchState({ query, view = 'my', allowSharing, auth, entityId, platformId }) {
  const [isSearchVisible, setSearchVisible] = useState(!!query);
  const routeName = useRouteName();
  const [previousEntityId, setPreviousEntityId] = useState(entityId);
  const [previousView, setPreviousView] = useState(view);
  const firestore = useFirestore();

  if (!entityId) {
    return null;
  }

  const [searchState, setSearchState] = useState(() => {
    const stateFromParams = { ...urlToSearchState(window.location.search) };

    delete stateFromParams.view;

    return { ...initialSearchState, ...stateFromParams };
  });

  const debouncedSearchState = useDebounce(searchState, DEBOUNCE_TIME);

  const facetFilters = useMemo(() => {
    const filters = [`state:${view === "deleted" ? "deleted" : "active"}`];

    if (!allowSharing || view === "my") {
      filters.push(`uid:${auth.uid}`);
    }

    return filters;
  }, [view]);

  useEffect(() => {
    async function fn() {
      const viewDoc = await firestore
        .collection("views")
        .doc(view)
        .get();

      const viewData = viewDoc.exists ? { ...viewDoc.data(), id: viewDoc.id } : null;

      if (viewData && (viewData.filters || viewData.query)) {
        const { query, filters } = viewData;

        let refinementList, range, toggle;

        for (const key of Object.keys(filters)) {
          const filter = filters[key];

          if (filter.min && filter.max) {
            range = range || {};
            range[key] = filter;
          } else if (_.isBoolean(filter)) {
            toggle = toggle || {};
            toggle[key] = filter;
          } else {
            refinementList = refinementList || {};
            refinementList[key] = filter;
          }
        }

        setSearchState((currentSearchState) => ({
          ...currentSearchState,
          range,
          query,
          refinementList,
          toggle
        }));

        if (query) {
          setSearchVisible(true);
        }

      } else {
        if (view !== previousView) {
          setSearchState(initialSearchState);
          setSearchVisible(false);
        }
      }

      setPreviousView(view);
    }

    fn();
  }, [view, previousView]);

  useEffect(() => {
    if (previousEntityId !== entityId) {
      setSearchState(initialSearchState);
      setSearchVisible(false);
    }

    setPreviousEntityId(entityId);
  }, [entityId]);

  useEffect(
    () => {
      if (!_.isEmpty(debouncedSearchState)) {
        const sanitizedParams = cleanUpSearchState(debouncedSearchState);
        
        if (_.isEmpty(sanitizedParams)) {
          return;
        }

        const transformedParams = decodeURIComponent(qs.stringify(sanitizedParams))
          .split('&')
          .reduce((acc, pair) => {
            const split = pair.split('=');
            acc[split[0]] = split[1];

            return acc;
          }, {});

        const params = { platformId, entityId };

        if (view) {
          params.view = view;
        }

        Router.pushRoute(
          routeName, { ...params, ...transformedParams }
        );
      }
    },
    [debouncedSearchState]
  );

  return {
    facetFilters,
    isSearchVisible,
    setSearchVisible,
    onSearchStateChange: setSearchState,
    searchState: searchState,
  };
}

export default useSearchState;
