import { compose, branch, renderComponent, pure } from "recompose";
import FieldValuePrimitive from "containers/FieldValuePrimitive";
import FieldValueRelation from "containers/FieldValueRelation";

export default compose(
  pure,
  branch(({ field }) => !!field.relation, renderComponent(FieldValueRelation))
)(FieldValuePrimitive);
