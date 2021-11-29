const { login } = require('../../services/users');

module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  const { token, code, message } = await login({ email, password });

  if (message) {
    return next({ message, code });
  }

  return res.status(code).json({ token });
};
