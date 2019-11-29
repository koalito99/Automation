import { compose, branch, withProps, renderComponent } from "recompose";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";
import FormField from "containers/FormField";
import DisplayField from "containers/DisplayField";

import withConfiguration from "helpers/withConfiguration";

const mapStateToProps = (state, props) => {
  const relation = props.field.relation;
  const entities = relation && relation[props.field.relationType === "source" ? "target" : "source"];
  const childEntityId = entities.length && entities[0].id;

  return { childEntityId };
};

export default compose(
  withFirestore,
  withConfiguration,
  connect(mapStateToProps),
  withProps(({ entityId, childEntityId, items, configuration }) => {
    const orderedTitleFields =
      entityId && configuration.entities.data[childEntityId].fields.filtered.title;
    const additionalProps = {};

    const options =
      (items &&
        items.map(item => {
          return {
            label: _.map(orderedTitleFields, field => item[field.id])
              .filter(s => !!s)
              .join(" ∙ "),
            value: item.id
          };
        })) ||
      [];

    return {
      ...additionalProps,
      options,
      entityId: childEntityId,
      parentEntityId: entityId,
      orderedTitleFields
    };
  }),
  branch(({ mode }) => mode === "edit", renderComponent(FormField))
)(DisplayField);
