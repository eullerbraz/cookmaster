const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient, ObjectId } = require('mongodb');

const { expect } = chai;
const server = require('../api/app');
const getConnection = require('./mocks/connectionMock');

const ID = '61aaa2e17ea86314e0da07f6';
const RECIPE_URI = `/recipes/${ID}`;
const payloadRecipe = {
  _id: ObjectId(ID),
  name: 'recipe',
  ingredients: 'ingredients',
  preparation: 'preparation',
  userId: '61aaa2e17ea86314e0da07f9',
};

chai.use(chaiHttp);

describe('GET /recipes/:id', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('Quando o id é inválido', () => {
    let response;

    before(async () => {
      await connectionMock.db('Cookmaster')
      .collection('recipes')
      .insertOne({ ...payloadRecipe });

      response = await chai.request(server)
        .get('/recipes/idInvalido');
    });

    after(async () => {
      await connectionMock.db('Cookmaster')
      .collection('recipes')
      .deleteMany({});
    });

    it('Retorna um código de status "404"', () => {
      expect(response).to.have.status(404);
    });

    it('Retorna um objeto', () => {
      expect(response).to.have.be.an('object');
    });

    it('Retorna o objeto possui o atributo message com a mensagem "recipe not found"', () => {
      expect(response.body.message).to.be.equal('recipe not found');
    });
  });

  describe('Quando a receita não é encontrada', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .get(RECIPE_URI);
    });

    it('Retorna um código de status "404"', () => {
      expect(response).to.have.status(404);
    });

    it('Retorna um objeto', () => {
      expect(response).to.have.be.an('object');
    });

    it('Retorna o objeto possui o atributo message com a mensagem "recipe not found"', () => {
      expect(response.body.message).to.be.equal('recipe not found');
    });
  });

  describe('Quando a receita é encontrada', () => {
    let response;

    before(async () => {
      await connectionMock.db('Cookmaster')
      .collection('recipes')
      .insertOne({ ...payloadRecipe });

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

    it('Retorna um objeto no body', () => {
      expect(response.body).to.have.be.an('object');
    });

    it('O objeto deve ser igual o objeto procurado', () => {
      expect(response.body).to.be.deep.equal({ ...payloadRecipe, _id: ID });
    });
  });
});
