const {
  create,
  getAll,
  findById,
} = require('../entity');

const COLLECTION = 'recipes';

module.exports = {
  create: (recipe) => create(COLLECTION, recipe),
  getAll: () => getAll(COLLECTION),
  findById: (recipeId) => findById(COLLECTION, recipeId),
};
