const recipeService = require('../../services/recipes');

module.exports = async (req, res, next) => {
  const { name, ingredients, preparation } = req.body;
  const { _id: userId } = req.user;
  const { id: recipeId } = req.params;

  const { message, recipe, code } = await recipeService
    .update({ name, ingredients, preparation }, recipeId, userId);

  if (message) return next({ code, message });

  return res.status(code).json(recipe);
};
