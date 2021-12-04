const { StatusCodes } = require('http-status-codes');

const { verifyUser } = require('../services/auth');

module.exports = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next({ message: 'missing auth token', code: StatusCodes.UNAUTHORIZED });
  }

  const user = verifyUser(authorization);

  if (!user) {
    return next({ message: 'jwt malformed', code: StatusCodes.UNAUTHORIZED });
  }

  req.user = user;

  next();
};
