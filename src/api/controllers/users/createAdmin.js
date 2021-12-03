const userService = require('../../services/users');

module.exports = async (req, res, next) => {
  const { name, email, password } = req.body;
  const { role } = req.user;

  const { message, user, code } = await userService.createAdmin({ name, email, password }, role);

  if (message) return next({ code, message });

  return res.status(code).json({ user });
};
