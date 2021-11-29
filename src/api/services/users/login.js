const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const userModel = require('../../models/users');

const SECRET = 'mysecret';

const auth = (user) => {
  const jwtConfig = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };

  const token = jwt.sign({ data: user }, SECRET, jwtConfig);

  return token;
};

const login = async (user) => {
  const { email, password } = user;

  if (!email || !password) {
    return { message: 'All fields must be filled', code: StatusCodes.UNAUTHORIZED };
  }

  const found = await userModel.findByEmail(email);

  if (!found || found.password !== password) {
    return { message: 'Incorrect username or password', code: StatusCodes.UNAUTHORIZED };
  }

  const token = auth(user);

  return { token, code: StatusCodes.OK };
};

module.exports = login;
