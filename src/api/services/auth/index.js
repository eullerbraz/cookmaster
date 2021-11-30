const jwt = require('jsonwebtoken');

const SECRET = 'mysecret';

const signUser = (user) => {
  const jwtConfig = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };

  const token = jwt.sign({ data: user }, SECRET, jwtConfig);

  return token;
};

const verifyUser = (token) => {
  try {
    const { data } = jwt.verify(token, SECRET);

    return data;
  } catch (_error) {
    return null;
  }
};

module.exports = {
  signUser,
  verifyUser,
};
