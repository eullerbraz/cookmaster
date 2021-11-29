const connection = require('../connection');

module.exports = async (collection, item) => {
  const db = await connection();
  const { insertedId } = await db.collection(collection).insertOne(item);

  const { _id, password, ...newItem } = item;

  return { ...newItem, _id: insertedId };
};
