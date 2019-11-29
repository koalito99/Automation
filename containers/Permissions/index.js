import PermissionResource from 'constants/resources/permission';
import composeResource from 'helpers/composeResource';
import TableView from 'components/TableView';

export default composeResource(PermissionResource)(TableView);
