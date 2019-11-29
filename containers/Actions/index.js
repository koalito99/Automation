import ActionResource from 'constants/resources/action';
import composeResource from 'helpers/composeResource';
import connectActions from 'connectors/actions';
import TableView from 'components/TableView';

export default composeResource(
  ActionResource,
  connectActions
)(TableView);
