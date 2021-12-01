const { StatusCodes } = require('http-status-codes');

const recipeModel = require('../../models/recipes');

module.exports = async (imageName, recipeId, userId) => {
  const found = await recipeModel.findById(recipeId);

  if (!found) {
    return { message: 'recipe not found', code: StatusCodes.NOT_FOUND };
  }

  const image = `localhost:3000/src/uploads/${imageName}`;

  const updated = await recipeModel.update({ image, userId, id: recipeId });

  return { recipe: { ...found, ...updated }, code: StatusCodes.OK };
};
