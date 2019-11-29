import { memo } from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";

import SourceImportDialog from "../../components/SourceImportDialog";
import { firestoreConnect, withFirestore } from "react-redux-firebase";
import { Router } from "../../routes";
import withRouter from "../../helpers/withRouter";
import doImport from "../../helpers/sourceImport";

const mapStateToProps = state => ({
  sources: state.firestore.ordered.sources
});

export default compose(
  connect(
    mapStateToProps,
    null
  ),
  withRouter,
  withFirestore,
  withState("draft", "setDraft", {}),
  withState("errors", "setErrors", {}),
  withState("isLoading", "setIsLoading", false),
  withHandlers({
    onChangeHandler: ({ draft, setDraft }) => field => e => {
      setDraft({
        ...draft,
        [field]: e.target ? e.target.value : e
      });
    },
    onCancelHandler: ({ platformId, source }) => () => {
      Router.pushRoute("sources", {
        platformId,
        type: source.type
      });
    }
  }),
  withHandlers({
    onSubmitHandler: ({ onCancelHandler, draft, source, setIsLoading }) => async e => {
      e.preventDefault();

      setIsLoading(true);

      try {
        await doImport(draft.files, source.id);

        setIsLoading(false);
        onCancelHandler();
      } catch (e) {
        setIsLoading(false);
      }
    }
  })
)(memo(SourceImportDialog));
