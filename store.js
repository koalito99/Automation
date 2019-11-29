import _ from "lodash";
import { createStore, combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import { composeWithDevTools } from "redux-devtools-extension";
import pageReducers from "./reducers/pages";
import routeReducers from "./reducers/route";
import recordsReducers from "./reducers/records";
import draftReducers from "./reducers/draft";
import filtersReducers from "./reducers/filters";
import indexingReducers from "./reducers/indexing";
import drawerReducers from "./reducers/drawer";

export default (initialState = {}) => {
  const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    pages: pageReducers,
    route: routeReducers,
    draft: draftReducers,
    records: recordsReducers,
    filters: filtersReducers,
    indexing: indexingReducers,
    drawer: drawerReducers
  });

  return createStore(rootReducer, initialState, composeWithDevTools());
};
