import FieldResource from "constants/resources/field";
import composeResource from "helpers/composeResource";
import TableView from "components/TableView";

import withRouterParams from "helpers/withRouterParams";
import connectEntities from "connectors/entities";
import connectTypes from "connectors/types";
import connectActions from "connectors/actions";
import connectRelations from "connectors/relations";
import connectValidators from "connectors/validators";

export default composeResource(
  FieldResource,
  withRouterParams("platformId"),
  connectEntities,
  connectTypes,
  connectActions,
  connectRelations,
  connectValidators
)(TableView);
