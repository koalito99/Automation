import { compose } from 'recompose';
import { connect } from 'react-redux';

import firestoreConnectForKeys from 'helpers/firestoreConnectForKeys';

const mapStateToProps = (state, props) => ({
  item: _.get(state.firestore.data.records, props.id),
});

export default compose(
  connect(mapStateToProps),
  firestoreConnectForKeys('id', ({ id }) => [
    {
      collection: `records`,
      doc: id
    }
  ]),
);