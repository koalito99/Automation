import _ from 'lodash';
import { withProps, renameProp } from 'recompose';
import ViewResource from 'constants/resources/view';
import composeResource from 'helpers/composeResource';
import TableView from 'components/TableView';

import connectEntities from 'connectors/entities';
import connectEntityFields from 'connectors/entityFields';
import connectFields from 'connectors/fields';

export default composeResource(
  ViewResource,
  connectEntities,
  withProps(({ draft }) => { 
    return ({ entityId: _.get(draft, 'entity.id') });
  }),
  connectEntityFields,
  renameProp('fields', 'entityFields'),
  connectFields,
)(TableView);
