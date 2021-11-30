const { StatusCodes } = require('http-status-codes');
const { signUser } = require('../auth');
const userModel = require('../../models/users');

const login = async (user) => {
  const { email, password } = user;

  if (!email || !password) {
    return { message: 'All fields must be filled', code: StatusCodes.UNAUTHORIZED };
  }

  const found = await userModel.findByEmail(email);

  if (!found || found.password !== password) {
    return { message: 'Incorrect username or password', code: StatusCodes.UNAUTHORIZED };
  }

  const token = signUser(found);

  return { token, code: StatusCodes.OK };
};

module.exports = login;
