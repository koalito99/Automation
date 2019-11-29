import { compose, branch, renderComponent, pure } from 'recompose';
import FilterValuePrimitive from 'containers/FilterValuePrimitive';
import FilterValueRelation from 'containers/FilterValueRelation';

export default compose(
  pure,
  branch(
    ({ field }) => !!field.relation,
    renderComponent(FilterValueRelation)
  )
)(FilterValuePrimitive);
