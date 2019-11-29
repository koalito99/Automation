import _ from "lodash";
import { compose, withProps, onlyUpdateForKeys } from "recompose";
import { connect } from "react-redux";

import withRouterParams from "helpers/withRouterParams";
import withConfiguration from "helpers/withConfiguration";
import withIndexing from "helpers/withIndexing";
import withRecordsSelection from "helpers/withRecordsSelection";

import MasterDetailsView from "components/MasterDetailsView";

function mapStateToProps(state) {
  return {
    auth: state.firebase.auth
  };
}

export default compose(
  withConfiguration,
  withRouterParams("platformId", "entityId", "id", "view", "query"),
  withIndexing,
  withRecordsSelection,
  connect(mapStateToProps),
  withProps(({ configuration, entityId }) => ({
    allowSharing: entityId && configuration.entities.data[entityId].allowSharing
  }))
)(MasterDetailsView);
