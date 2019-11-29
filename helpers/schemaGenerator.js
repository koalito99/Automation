import _ from "lodash";

const typeAndFieldsToTypeSchema = fields => {
  let schema = fields.reduce((accumulator, field) => {
    accumulator += `    ${_.snakeCase(field)}: String\n`;

    return accumulator;
  }, `type Table { \n`);

  schema += "}";

  return schema;
};

export { typeAndFieldsToTypeSchema };
