const { StatusCodes } = require('http-status-codes');

const recipeModel = require('../../models/recipes');
const schema = require('../../schemas/recipe');

module.exports = async (newRecipe, recipeId, userId) => {
  const { error } = schema.validateRecipe(newRecipe);

  if (error) {
    return { message: 'Invalid entries. Try again.', code: StatusCodes.BAD_REQUEST };
  }

  const found = await recipeModel.findById(recipeId);

  if (!found) {
    return { message: 'recipe not found', code: StatusCodes.NOT_FOUND };
  }

  const updated = await recipeModel.update({ ...newRecipe, userId, id: recipeId });

  return { recipe: updated, code: StatusCodes.OK };
};
