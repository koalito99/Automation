import { compose } from "recompose";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";

import { STATE_TYPES } from "blondie-platform-common";

import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";

export function connector({ firestore, entityId }) {
  return [
    {
      collection: `relations`,
      where: [
        ["state", "==", STATE_TYPES.ACTIVE],
        ["source", "==", firestore.collection("entities").doc(entityId)]
      ],
      storeAs: `entities/${entityId}/relations/source`
    }
  ];
}

export function selector(state, props) {
  return state.firestore.ordered[`entities/${props.entityId}/relations/source`];
}

const mapStateToProps = (state, props) => ({
  sourceRelations: selector(state, props)
});

export default compose(
  withFirestore,
  connect(mapStateToProps),
  firestoreConnectForKeys("entityId", connector)
);
