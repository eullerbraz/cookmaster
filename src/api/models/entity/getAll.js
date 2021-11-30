const connection = require('../connection');

module.exports = async (collection) => {
  const db = await connection();
  const rows = await db.collection(collection).find().toArray();

  return rows;
};
