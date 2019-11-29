import _ from "lodash";
import { GraphQLClient } from "graphql-request";

export default class Graphql {
  constructor(firebase, sourceId) {
    this.firebase = firebase;
    this.sourceId = sourceId;
  }

  async upsert(entityName, params, propsToReturn) {
    const action = params.id ? "update" : "create";
    const mutationName = `${action}${_.capitalize(entityName.toLowerCase())}`;

    const query = `
      mutation {
        ${mutationName}(input: { ${this._paramsToString(params)} }) {
          ${this._getPropertiesAsString(propsToReturn)}
        }
      }
    `;

    const data = await this._request(query);

    console.log({ DATA: data });

    return data[mutationName];
  }

  async _request(query) {
    const host = `https://europe-west1-blondie-platform-dev.cloudfunctions.net`; // `http://localhost:5000/blondie-platform-dev/us-central1`;
    const endpoint = `${host}/graphql/${this.sourceId}/graphql`;

    console.log({ endpoint });

    if (!this.firebase.auth().currentUser) {
      throw new Error("Unauthorized");
    }

    const token = await this.firebase.auth().currentUser.getIdToken();

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    console.log({ REQUEST: query });

    try {
      const result = await graphQLClient.request(query);

      return result;
    } catch (e) {
      console.log("[--- index.js:114 ---]", e);
    }
  }

  _getPropertiesAsString(propNames) {
    return propNames.reduce((accumulator, name) => {
      accumulator += `${name}\n`;

      return accumulator;
    }, "");
  }

  _paramsToString(params) {
    const paramsAsStringParts = Object.keys(params).reduce(
      (accumulator, prop) => {
        let value;

        if (_.isString(params[prop])) {
          value = `"${params[prop]}"`;
        } else if (_.isPlainObject(params[prop])) {
          value = `{ id: "${params[prop].id}" }`;
        } else if (_.isArray(params[prop])) {
          value = `[${params[prop]
            .map(item => `{ id: "${item.id}" }`)
            .join(", ")}]`;
        } else {
          value = params[prop];
        }

        accumulator.push(`${prop}: ${value}`);

        return accumulator;
      },
      []
    );

    return paramsAsStringParts.join(", ");
  }
}
