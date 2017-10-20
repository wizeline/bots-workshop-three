const Wit = require('node-wit');

const THRESHOLD = 0.65;

class WitAdapter {
  constructor(accessToken) {
    this.wit = new Wit({
      accessToken
    });
  }

  processMessage(message) {
    return this.wit.message(message, {});
  }

  getEntities(message) {
    return this.processMessage(message).then(witResponse => {
      const entities = witResponse.entities;
      const flatEntities = {};

      Object.entries(entities).forEach(([entity, values]) => {
        values.some(value => {
          if(value.confidence >= THRESHOLD) {
            flatEntities[entity] = value.value;
            return true;
          }
        });
      });

      return flatEntities;
    });
  }
}

const token = process.env.WIT_ACCESS_TOKEN;
const adapter = new WitAdapter(token);

module.exports = adapter;