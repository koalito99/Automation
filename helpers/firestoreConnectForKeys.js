import _ from 'lodash';
import { firestoreConnect } from 'react-redux-firebase'

export default (...args) => firestoreConnect((props) => {
  const keys = [...args];
  const fn = keys.pop();
  
  return _.some(keys, key => !props[key]) 
    ? []
    : fn(props)
});