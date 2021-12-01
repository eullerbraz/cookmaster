const { StatusCodes } = require('http-status-codes');

const recipeModel = require('../../models/recipes');

module.exports = async (recipeId) => {
  const found = await recipeModel.findById(recipeId);

  if (!found) {
    return { message: 'recipe not found', code: StatusCodes.NOT_FOUND };
  }
  
  await recipeModel.remove(recipeId);

  return { code: StatusCodes.NO_CONTENT };
};
