import { compose } from "recompose";
import { connect } from "react-redux";

import withOrderedEntityFilterableFields from "helpers/withOrderedEntityFilterableFields";
import FiltersDrawer from "components/MasterDetailsView/FiltersDrawer";
import { toggle } from "actions/filters";

function mapStateToProps(state) {
  return {
    open: state.filters.visible
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(toggle(false))
  };
}

export default compose(
  withOrderedEntityFilterableFields,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FiltersDrawer);
