import ValidatorResource from 'constants/resources/validator';
import composeResource from 'helpers/composeResource';
import TableView from 'components/TableView';

export default composeResource(ValidatorResource)(TableView);
