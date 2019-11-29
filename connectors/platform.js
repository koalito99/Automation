import _ from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import firestoreConnectForKeys from 'helpers/firestoreConnectForKeys';

const mapStateToProps = (state, props) => ({
  platform: _.get(state.firestore.data.platforms, props.platformId)
});

export default compose(
  connect(mapStateToProps),
  firestoreConnectForKeys('platformId', ({ platformId }) => [
    {
      collection: 'platforms',
      doc: platformId
    }
  ]),
);