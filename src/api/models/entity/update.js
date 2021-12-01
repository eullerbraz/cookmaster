const { ObjectId } = require('mongodb');

const connection = require('../connection');

module.exports = async (collection, newItem) => {
  try {
    const { id, ...data } = newItem;
    const db = await connection();
    await db.collection(collection).updateOne(
      { _id: ObjectId(id) },
      { $set: { ...data } },
    );
  
    return { _id: id, ...data };
  } catch (_error) {
    return null;
  }
};
