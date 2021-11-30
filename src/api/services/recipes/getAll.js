const { StatusCodes } = require('http-status-codes');

const recipeModel = require('../../models/recipes');

module.exports = async () => {
  const recipes = await recipeModel.getAll();

  return { recipes, code: StatusCodes.OK };
};
