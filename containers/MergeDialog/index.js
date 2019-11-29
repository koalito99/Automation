import { compose } from "recompose";

import MergeDialog from "components/MergeDialog";
import withConfiguration from "helpers/withConfiguration";
import withRecordsSelection from "helpers/withRecordsSelection";

export default compose(
  withConfiguration,
  withRecordsSelection
)(MergeDialog);
