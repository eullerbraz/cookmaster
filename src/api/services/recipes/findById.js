const { StatusCodes } = require('http-status-codes');

const recipeModel = require('../../models/recipes');

module.exports = async (id) => {
  const recipe = await recipeModel.findById(id);

  if (!recipe) {
    return { message: 'recipe not found', code: StatusCodes.NOT_FOUND };
  }

  return { recipe, code: StatusCodes.OK };
};
