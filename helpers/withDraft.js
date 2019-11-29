import _ from "lodash";
import { compose, withHandlers, lifecycle } from "recompose";
import { connect } from "react-redux";
import { setDraft, setErrors } from "../actions/draft";
import getDraft from "../selectors/getDraft";
import getErrors from "../selectors/getDraftErrors";

function mapStateToProps(state, props) {
  return {
    draft: getDraft(state, props.entityId, props.id),
    errors: getErrors(state, props.entityId, props.id)
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    setDraft: draft => {
      dispatch(setDraft(props.entityId, props.id, draft));
    },
    setErrors: errors => {
      dispatch(setErrors(props.entityId, props.id, errors));
    }
  };
}

export default getInitialProps =>
  compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    ),
    withHandlers({
      onDraftChange: ({ draft, setDraft, errors, setErrors }) => (field, value) => {
        setErrors(_.omit(errors, field));

        setDraft({
          ...draft,
          [field]: value
        });
      }
    }),
    lifecycle({
      componentDidMount() {
        const { id, setDraft } = this.props;
        let { item } = this.props;

        if (id === "new") {
          item = getInitialProps ? getInitialProps(this.props) : {};
        }

        setDraft(item);
      },
      componentWillReceiveProps(props) {
        const { id, entityId, setDraft } = props;
        let { item } = props;
        const idChanged = id !== this.props.id;
        const entityIdChanged = entityId !== this.props.entityId;
        const itemChanged = item !== this.props.item;

        if (idChanged || entityIdChanged || itemChanged) {
          if (id === "new") {
            item = getInitialProps ? getInitialProps(props) : {};
          }

          setDraft(item);
        }
      }
    })
  );
