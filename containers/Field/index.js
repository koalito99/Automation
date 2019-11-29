import { compose, branch, renderComponent, pure } from "recompose";
import FieldPrimitive from "containers/FieldPrimitive";
import FieldRelation from "containers/FieldRelation";

export default compose(
  pure,
  branch(({ field }) => !field.type && !!field.relation, renderComponent(FieldRelation))
)(FieldPrimitive);
