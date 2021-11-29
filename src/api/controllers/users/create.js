const userService = require('../../services/users');

module.exports = async (req, res, next) => {
  const { name, email, password } = req.body;

  const { message, user, code } = await userService.create({ name, email, password });

  if (message) return next({ code, message });

  res.status(code).json({ user });
};