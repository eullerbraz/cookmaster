const recipeService = require('../../services/recipes');

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const { code, message } = await recipeService.remove(id);

  if (message) return next({ message, code });

  return res.status(code).end();
};
