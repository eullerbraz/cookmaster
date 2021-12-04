const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const { expect } = chai;
const server = require('../api/app');
const getConnection = require('./mocks/connectionMock');

const RECIPE_URI = '/recipes';
const payloadRecipe1 = {
  _id: '61aaa2e17ea86314e0da07f6',
  name: 'recipe',
  ingredients: 'ingredients',
  preparation: 'preparation',
  userId: '61aaa2e17ea86314e0da07f9',
};
const payloadRecipe2 = {
  _id: '61aaa2e17ea86314e0da07f7',
  name: 'recipe2',
  ingredients: 'ingredients2',
  preparation: 'preparation2',
  userId: '61aaa2e17ea86314e0da07f9',
};

chai.use(chaiHttp);

describe('GET /recipes', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('Quando a listagem é feita com sucesso', () => {
    let response;

    before(async () => {
      await connectionMock.db('Cookmaster')
      .collection('recipes')
      .insertMany([payloadRecipe1, payloadRecipe2]);

      response = await chai.request(server)
        .get(RECIPE_URI);
    });

    after(async () => {
      await connectionMock.db('Cookmaster')
      .collection('recipes')
      .deleteMany({});
    });

    it('Retorna um código de status "200"', () => {
      expect(response).to.have.status(200);
    });

    it('Retorna um array no body', () => {
      expect(response.body).to.have.be.an('array');
    });

    it('O array deve conter as receitas no BD', () => {
      expect(response.body).to.be.deep.equal([payloadRecipe1, payloadRecipe2]);
    });
  });
});
