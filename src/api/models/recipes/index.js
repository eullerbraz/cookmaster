const { create } = require('../entity');

const COLLECTION = 'recipes';

module.exports = {
  create: (user) => create(COLLECTION, user),
};
