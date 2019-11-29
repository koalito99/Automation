import EntityResource from "constants/resources/entity";
import composeResource from "helpers/composeResource";
import TableView from "components/TableView";
import withRouterParams from "helpers/withRouterParams";
import connectActions from "connectors/actions";
import connectWidgets from "connectors/widgets";

export default composeResource(
  EntityResource,
  withRouterParams("platformId"),
  connectActions,
  connectWidgets
)(TableView);
