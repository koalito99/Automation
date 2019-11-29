import _ from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import firestoreConnectForKeys from 'helpers/firestoreConnectForKeys';

const mapStateToProps = (state, props) => ({
  entity: _.get(state.firestore.data.entities, props.entityId)
});

export default compose(
  connect(mapStateToProps),
  firestoreConnectForKeys('entityId', ({ entityId }) => [
    {
      collection: 'entities',
      doc: entityId
    }
  ]),
);