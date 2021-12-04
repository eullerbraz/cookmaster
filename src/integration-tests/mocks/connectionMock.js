const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const DBServer = new MongoMemoryServer();
const OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };

module.exports = async () => {
  const URLMock = await DBServer.getUri();
  return await MongoClient.connect(URLMock, OPTIONS);
}
