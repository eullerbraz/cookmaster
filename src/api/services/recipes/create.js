const { StatusCodes } = require('http-status-codes');

const recipeModel = require('../../models/recipes');
const schema = require('../../schemas/recipe');

module.exports = async (recipe, userId) => {
  const { error } = schema.validateRecipe(recipe);

  if (error) {
    return { message: 'Invalid entries. Try again.', code: StatusCodes.BAD_REQUEST };
  }

  const created = await recipeModel.create({ ...recipe, userId });

  return { recipe: created, code: StatusCodes.CREATED };
};
