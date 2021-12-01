const { ObjectId } = require('mongodb');

const connection = require('../connection');

module.exports = async (collection, id) => {
  try {
    const db = await connection();
    const row = await db.collection(collection).findOne({ _id: ObjectId(id) });
  
    return row;
  } catch (_error) {
    return null;
  }
};
