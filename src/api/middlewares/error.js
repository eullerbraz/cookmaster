module.exports = (err, req, res, _next) => {
  const { message, code } = err;
  return res.status(code).json({ message });
};
