import { memo } from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import _ from "lodash";

import SOURCES from "constants/sources";

import SourceDialog from "../../components/SourceDialog";
import { withFirestore } from "react-redux-firebase";
import { Router } from "../../routes";
import withDraft from "../../helpers/withDraft";
import withRouter from "../../helpers/withRouter";
import { STATE_TYPES } from "blondie-platform-common";
import withConfiguration from '../../helpers/withConfiguration';

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
  withConfiguration,
  withState("errors", "setErrors", {}),
  withState("draft", "setDraft", {}),
  withHandlers({
    onChangeHandler: ({ draft, setDraft }) => field => e => {
      setDraft({
        ...draft,
        [field]: e.target ? e.target.value : e
      });
    },
    onSubmitHandler: ({ draft, source, platformId, firestore, setErrors }) => async e => {
      e.preventDefault();

      const type = source.type;
      const config = SOURCES.find(src => src.type === type);

      const errors = {};

      for (const field of config.schema) {
        if (field.required) {
          if (!draft[field.name]) {
            errors[field.name] = `${field.label} is required`;
          }
        }
      }

      if (!_.isEmpty(errors)) {
        setErrors(errors);

        return;
      }

      await firestore.collection("sources").add({
        type,
        platform: firestore.collection("platforms").doc(platformId),
        state: STATE_TYPES.ACTIVE,
        ...draft
      });

      Router.pushRoute("sources", { type, platformId });
    },
    onCancelHandler: ({ onCancel, setDraft, setErrors }) => () => {
      onCancel();

      setDraft({});
      setErrors({});
    }
  })
)(SourceDialog);
