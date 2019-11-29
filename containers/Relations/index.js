import RelationResource from 'constants/resources/relation';
import composeResource from 'helpers/composeResource';
import connectEntities from 'connectors/entities';
import connectTypes from 'connectors/types';
import TableView from 'components/TableView';

export default composeResource(
  RelationResource,
  connectEntities,
  connectTypes
)(TableView);
