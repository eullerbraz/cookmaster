const { StatusCodes } = require('http-status-codes');

const userModel = require('../../models/users');
const schema = require('../../schemas/user');

module.exports = async (user) => {
  const { error } = schema.validateUser(user);

  if (error) {
    return { message: 'Invalid entries. Try again.', code: StatusCodes.BAD_REQUEST };
  }

  const found = await userModel.findByEmail(user.email);

  if (found) {
    return { message: 'Email already registered', code: StatusCodes.CONFLICT };
  }

  const created = await userModel.create({ ...user, role: 'user' });

  return { user: created, code: StatusCodes.CREATED };
};
