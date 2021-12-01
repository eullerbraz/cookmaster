const {
  create,
  getAll,
  findById,
  update,
  remove,
} = require('../entity');

const COLLECTION = 'recipes';

module.exports = {
  create: (recipe) => create(COLLECTION, recipe),
  getAll: () => getAll(COLLECTION),
  findById: (recipeId) => findById(COLLECTION, recipeId),
  update: (newRecipe) => update(COLLECTION, newRecipe),
  remove: (recipeId) => remove(COLLECTION, recipeId),
};
