import _ from "lodash";
import { compose, withState, lifecycle } from "recompose";
import { connect } from "react-redux";
import { setIndexing } from "../actions/indexing";
import getIndexing from "../selectors/getIndexing";
import withRouterParams from "../helpers/withRouterParams";
import { firestoreConnect } from "react-redux-firebase";

function mapStateToProps(state, props) {
  return {
    lastIndexedAt: _.get(state.firestore.data, ["entities", props.entityId, "lastIndexedAt"]),
    indexing: getIndexing(state, props.entityId)
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    setIndexing: value => dispatch(setIndexing(props.entityId, value))
  };
}

export default compose(
  withRouterParams("view"),
  withState("refreshResults", "setRefreshResults", false),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    return [
      {
        collection: "entities",
        doc: props.entityId
      }
    ];
  }),
  lifecycle({
    componentWillReceiveProps({ lastIndexedAt, view, setRefreshResults, setIndexing }) {
      const prev = this.props;
      const lastIndexedAtChanged = lastIndexedAt !== prev.lastIndexedAt;
      const viewChanged = view !== prev.view;

      if (lastIndexedAtChanged || viewChanged) {
        setRefreshResults(true, () => setRefreshResults(false, () => setIndexing(false)));
      }
    }
  })
);
