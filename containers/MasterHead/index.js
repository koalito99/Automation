import _ from "lodash";
import { compose, shouldUpdate } from "recompose";
import { connectHits } from "react-instantsearch-dom";

import MasterHead from "components/MasterDetailsView/MasterHead";
import withRouterParams from "helpers/withRouterParams";
import withRecordsSelection from "helpers/withRecordsSelection";
import withOrderedEntityTableViewFields from "helpers/withOrderedEntityTableViewFields";

export default compose(
  withRecordsSelection,
  withRouterParams("platformId", "entityId"),
  withOrderedEntityTableViewFields,
  connectHits,
  shouldUpdate((props, nextProps) => {
    return (
      props.selected !== nextProps.selected ||
      props.entityId !== nextProps.entityId ||
      !_.isEqual(props.hits, nextProps.hits)
    );
  })
)(MasterHead);
