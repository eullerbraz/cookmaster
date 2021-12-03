const { StatusCodes } = require('http-status-codes');

const userModel = require('../../models/users');
const schema = require('../../schemas/user');

module.exports = async (user, loginRole) => {
  const { error } = schema.validateUser(user);

  if (error) {
    return { message: 'Invalid entries. Try again.', code: StatusCodes.BAD_REQUEST };
  }

  const found = await userModel.findByEmail(user.email);

  if (found) {
    return { message: 'Email already registered', code: StatusCodes.CONFLICT };
  }

  if (loginRole !== 'admin') {
    return { message: 'Only admins can register new admins', code: StatusCodes.FORBIDDEN };
  }

  const created = await userModel.create({ ...user, role: loginRole });

  return { user: created, code: StatusCodes.CREATED };
};
