import { compose } from "recompose";
import { withFirestore } from "react-redux-firebase";

import withOrderedEntityTableViewFields from "helpers/withOrderedEntityTableViewFields";
import withRouterParams from "helpers/withRouterParams";
import withTableHandlers from "helpers/withTableHandlers";
import Master from "components/MasterDetailsView/Master";

export default compose(
  withRouterParams("platformId", "id", "view"),
  withFirestore,
  withOrderedEntityTableViewFields,
  withTableHandlers({
    routes: {
      index: "resources",
      show: "resource",
      new: "resourceNew"
    }
  })
)(Master);
