const { create, findByEmail } = require('../entity');

const COLLECTION = 'users';

module.exports = {
  create: (user) => create(COLLECTION, user),
  findByEmail: (email) => findByEmail(COLLECTION, email),
};
