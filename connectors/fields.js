import { compose } from "recompose";
import { connect } from "react-redux";
import { withFirestore, firestoreConnect } from "react-redux-firebase";
import getFieldPermissions from "selectors/getFieldPermissions";

import { STATE_TYPES } from "blondie-platform-common";

const mapStateToProps = state => ({
  fields: state.firestore.data.fields,
  fieldPermissions: getFieldPermissions(state)
});

export default compose(
  connect(mapStateToProps),
  withFirestore,
  firestoreConnect([
    {
      collection: "fields",
      where: [["state", "==", STATE_TYPES.ACTIVE]],
      storeAs: `fields`
    }
  ])
);
