const Joi = require('joi');

const validateRecipe = (recipe) => {
  const schema = Joi.object({
    name: Joi.string().not().empty().required(),
    ingredients: Joi.string().not().empty().required(),
    preparation: Joi.string().not().empty().required(),
  }).validate(recipe);
  return schema;
};

module.exports = {
  validateRecipe,
};
