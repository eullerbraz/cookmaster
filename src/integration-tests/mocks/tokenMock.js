const jwt = require('jsonwebtoken');

const SECRET = 'mysecret';
const OPTIONS = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

module.exports = (data) => jwt.sign({ data }, SECRET, OPTIONS);
