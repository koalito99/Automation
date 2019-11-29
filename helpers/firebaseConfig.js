import _ from 'lodash';

const firebaseConfig = _.mapKeys(JSON.parse(process.env.FIREBASE_CONFIG), (value, key) =>
  _.camelCase(key).replace("Url", "URL")
);

export default firebaseConfig;
