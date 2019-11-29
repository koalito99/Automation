import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';

import firestoreConnectForKeys from 'helpers/firestoreConnectForKeys';

const mapStateToProps = (state, props) => ({
  entityView: _.get(state.firestore.data.views, props.view)
});

export default compose(
  connect(mapStateToProps),
  firestoreConnectForKeys('view', ({ view }) => [
    {
      collection: 'views',
      doc: view
    }
  ]),
);