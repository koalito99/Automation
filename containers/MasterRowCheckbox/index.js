import { compose } from 'recompose';

import MasterRowCheckbox from 'components/MasterDetailsView/MasterRowCheckbox';
import withRecordsSelection from 'helpers/withRecordsSelection';

export default compose(
  withRecordsSelection,
)(MasterRowCheckbox);