import { compose } from "recompose";
import { withFirestore } from "react-redux-firebase";
import { connectHits } from "react-instantsearch-dom";

import withEntityFields from "helpers/withEntityFields";
import withRouterParams from "helpers/withRouterParams";
import withTableHandlers from "helpers/withTableHandlers";
import MasterKanban from "components/MasterDetailsView/MasterKanban";

export default compose(
  withRouterParams("platformId", "id", "view"),
  connectHits,
  withEntityFields,
  withFirestore,
  withTableHandlers({
    routes: {
      index: "resources",
      show: "resource",
      new: "resourceNew"
    }
  })
)(MasterKanban);
