import { compose } from "recompose";
import { connect } from "react-redux";
import IndexingSnackbar from "../../components/IndexingSnackbar";
import withRouterParams from "../../helpers/withRouterParams";
import getIndexing from "../../selectors/getIndexing";

function mapStateToProps(state, props) {
  return {
    indexing: getIndexing(state, props.entityId)
  };
}

export default compose(
  withRouterParams("entityId"),
  connect(mapStateToProps)
)(IndexingSnackbar);
