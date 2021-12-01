const recipeService = require('../../services/recipes');

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const { recipe, code, message } = await recipeService.findById(id);

  if (message) return next({ message, code });

  return res.status(code).json(recipe);
};
