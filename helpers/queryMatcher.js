import _ from 'lodash';

export default (query) => (string) => (
  !query || string.toLowerCase().match(query.toLowerCase())
)