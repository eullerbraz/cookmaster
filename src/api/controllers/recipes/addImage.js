const recipeService = require('../../services/recipes');

module.exports = async (req, res, next) => {
  const { filename } = req.file;
  const { _id: userId } = req.user;
  const { id: recipeId } = req.params;

  const { message, recipe, code } = await recipeService
    .addImage(filename, recipeId, userId);

  if (message) return next({ code, message });

  return res.status(code).json(recipe);
};
