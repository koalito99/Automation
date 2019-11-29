import _ from "lodash";
import { compose, shouldUpdate } from "recompose";
import { connectHits } from "react-instantsearch-dom";
import withConfiguration from "../../helpers/withConfiguration";

import MasterBody from "components/MasterDetailsView/MasterBody";

export default compose(
  withConfiguration,
  connectHits,
  shouldUpdate(
    (props, nextProps) =>
      !_.isEqual(props.entityId, nextProps.entityId) || !_.isEqual(props.hits, nextProps.hits)
  )
)(MasterBody);
