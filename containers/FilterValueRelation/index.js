import { compose } from "recompose";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";

import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";
import withConfiguration from '../../helpers/withConfiguration';

const mapRecordsStateToProps = (state, props) => ({
  record: state.firestore.data.records && state.firestore.data.records[props.recordId]
});

export default compose(
  withFirestore,
  withConfiguration,
  firestoreConnectForKeys("recordId", ({ recordId }) => [
    {
      collection: "records",
      doc: recordId
    }
  ]),
  connect(mapRecordsStateToProps),
)(({ record, configuration }) => {
  const orderedTitleFields = record ? configuration.entities.data[record.entity.id].fields.filtered.title : [];

  return orderedTitleFields
        .map(field => record[field.id])
        .filter(s => !!s)
        .join(" ∙ ");
});
