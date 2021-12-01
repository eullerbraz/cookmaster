const { ObjectId } = require('mongodb');

const connection = require('../connection');

module.exports = async (collection, id) => {
  const db = await connection();
  await db.collection(collection).deleteOne({ _id: ObjectId(id) });
};
