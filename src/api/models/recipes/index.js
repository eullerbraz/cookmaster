const { create, getAll } = require('../entity');

const COLLECTION = 'recipes';

module.exports = {
  create: (recipe) => create(COLLECTION, recipe),
  getAll: () => getAll(COLLECTION),
};
