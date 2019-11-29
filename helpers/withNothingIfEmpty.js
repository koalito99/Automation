import _ from 'lodash';
import { branch, renderNothing } from 'recompose';

export default (...args) => branch(props => _.some(args, key => !_.get(props, key)), renderNothing);
