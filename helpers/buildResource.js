import _ from 'lodash';
import { pluralize } from 'inflection';

function nonEmpty(object) {
  const sanitizedObject = _.pickBy(object, _.identity);

  if (_.isEmpty(sanitizedObject)) return;

  return sanitizedObject;
}

export default (title, overrides = {}) => {
  const pluralTitle = pluralize(title);
  const name =  _.snakeCase(title);
  const pluralName = _.snakeCase(pluralTitle);

  const defaults = {
    title: {
      singular: title,
      plural: pluralTitle
    },
    name: {
      singular: name,
      plural: pluralName
    },
    routes: {
      index: ({ ...other } = {}) => ({ route: pluralName, params: nonEmpty({ ...other }) }),
      search: ({ query, ...other } = {}) => ({ route: pluralName, params: nonEmpty({ query, ...other }) }),
      new: ({ ...other } = {}) => ({ route: `${name}New`, params: nonEmpty({ ...other }) }),
      show: ({ id, ...other } = {}) => ({ route: name, params: nonEmpty({ id, ...other }) })
    },
    stateToProps: () => ({})
  };

  return _.defaultsDeep(overrides, defaults);
};