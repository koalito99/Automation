import { compose } from "recompose";
import { connect } from "react-redux";

import FiltersToggle from "components/MasterDetailsView/FiltersToggle";
import { toggle } from "actions/filters";

function mapDispatchToProps(dispatch) {
  return {
    onToggle: () => dispatch(toggle(true))
  };
}

export default compose(
  connect(
    null,
    mapDispatchToProps
  )
)(FiltersToggle);
