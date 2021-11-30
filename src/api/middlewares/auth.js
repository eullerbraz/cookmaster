const { StatusCodes } = require('http-status-codes');

const { verifyUser } = require('../services/auth');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  const user = verifyUser(authorization);

  if (!user) {
    return next({ message: 'jwt malformed', code: StatusCodes.UNAUTHORIZED });
  }

  req.user = user;

  next();
};
