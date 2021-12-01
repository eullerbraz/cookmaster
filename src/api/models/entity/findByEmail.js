const connection = require('../connection');

module.exports = async (collection, email) => {
  const db = await connection();
  const row = await db.collection(collection).findOne({ email });

  return row;
};
