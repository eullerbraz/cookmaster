const { StatusCodes } = require('http-status-codes');

module.exports = (err, req, res, _next) => {
  const { message, code } = err;

  if (code) {
    return res.status(code).json({ message });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
};
