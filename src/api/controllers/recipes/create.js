const recipeService = require('../../services/recipes');

module.exports = async (req, res, next) => {
  const { name, ingredients, preparation } = req.body;
  const { _id } = req.user;

  const { message, recipe, code } = await recipeService
    .create({ name, ingredients, preparation }, _id);

  if (message) return next({ code, message });

  res.status(code).json({ recipe });
};
