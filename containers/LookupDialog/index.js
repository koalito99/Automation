import { compose, withProps } from "recompose";
import { connect } from "react-redux";

import withConfiguration from "helpers/withConfiguration";
import LookupDialog from "components/LookupDialog";

function mapStateToProps(state) {
  return {
    auth: state.firebase.auth
  };
}

export default compose(
  withConfiguration,
  connect(mapStateToProps),
  withProps(({ configuration, entities }) => ({
    allowSharing: entities.reduce((acc, entity) => {
      acc[entity.id] = configuration.entities.data[entity.id].allowSharing;

      return acc;
    }, {})
  }))
)(LookupDialog);
