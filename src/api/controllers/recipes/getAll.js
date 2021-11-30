const recipeService = require('../../services/recipes');

module.exports = async (_req, res, _next) => {
  const { recipes, code } = await recipeService.getAll();

  return res.status(code).json(recipes);
};
