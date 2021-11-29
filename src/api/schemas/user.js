const Joi = require('joi');

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().not().empty().required(),
    email: Joi.string().email().required(),
    password: Joi.string().not().empty().required(),
  }).validate(user);
  return schema;
};

module.exports = {
  validateUser,
};
