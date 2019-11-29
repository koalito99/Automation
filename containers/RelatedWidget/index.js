import { compose, withState, lifecycle, withHandlers } from "recompose";
import { withFirestore } from "react-redux-firebase";

import withRouterParams from "helpers/withRouterParams";
import RelatedWidget from "components/RelatedWidget";

import { runCode, RecordContext } from "blondie-platform-common";

export default compose(
  withFirestore,
  withRouterParams("entityId", "id"),
  withState("src", "setSrc"),
  withState("expanded", "setExpanded", false),
  withHandlers({
    fetch: ({ entityId, id, widget, setSrc, firestore }) => async () => {
      const src = await runCode(widget.urlGenerator, {
        this: new RecordContext({ entityId, recordId: id, firestore }),
        entityId,
        id
      });

      setSrc(src);
    }
  }),
  lifecycle({
    componentDidUpdate({ id, expanded }) {
      if (id !== this.props.id) {
        this.props.setSrc(undefined);
        this.props.setExpanded(false);
      }

      if (this.props.expanded && !expanded) {
        this.props.fetch();
      }
    }
  })
)(RelatedWidget);
