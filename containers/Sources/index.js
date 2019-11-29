import SourceResource from "constants/resources/source";
import composeResource from "helpers/composeResource";
import Sources from "components/Sources";
import { withFirebase, firestoreConnect } from "react-redux-firebase";
import { withHandlers, withState, withProps } from "recompose";
import { connect } from "react-redux";
import { Router } from "../../routes";

const mapStateToProps = state => ({
  sources: state.firestore.ordered.sources
});

import { STATE_TYPES } from "blondie-platform-common";

export default composeResource(
  SourceResource,
  withFirebase,
  connect(
    mapStateToProps,
    null
  ),
  withState("isOpened", "setIsOpened", false),
  withState("source", "setSource"),
  firestoreConnect(({ firestore, platformId }) =>
    !platformId
      ? []
      : [
          {
            collection: "sources",
            where: [
              ["state", "==", STATE_TYPES.ACTIVE],
              ["platform", "==", firestore.collection("platforms").doc(platformId)]
            ]
          }
        ]
  ),
  withHandlers({
    onOpenHandler: ({ sources, onOpen, setIsOpened, setSource, platformId }) => item => () => {
      const { type } = item;

      const existingSourcesCount = _(sources)
        .filter({ type })
        .size();

      if (existingSourcesCount > 0) {
        Router.pushRoute("sources", { type, platformId });
      } else {
        setSource(item);
        setIsOpened(true);
      }
    },
    onCancelHandler: ({ setIsOpened, setSource }) => () => {
      setIsOpened(false);
      setSource(null);
    }
  })
)(Sources);
