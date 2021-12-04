const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const { expect } = chai;
const server = require('../api/app');
const getConnection = require('./mocks/connectionMock');
const getToken = require('./mocks/tokenMock');

const RECIPE_URI = '/recipes';
const payloadRecipe = {
  name: 'recipe',
  ingredients: 'ingredients',
  preparation: 'preparation',
};
const payloadUser = {
  _id: '61aaa2e17ea86314e0da07f9',
  email: 'teste@email.com',
  role: 'user',
};


chai.use(chaiHttp);

describe('POST /recipes', () => {
  let connectionMock;
  const tokenMock = getToken(payloadUser);

  before(async () => {
    connectionMock = await getConnection();

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('Quando não há token de autentificação', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post(RECIPE_URI)
        .send({ ...payloadRecipe });
    });

    it('Retorna um código de status "4001"', () => {
      expect(response).to.have.status(401);
    });

    it('Retorna um objeto', () => {
      expect(response).to.have.be.an('object');
    });

    it('Retorna o objeto possui o atributo message com a mensagem "missing auth token"', () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });

  describe('Quando o token de autentificação é inválido', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post(RECIPE_URI)
        .set('Authorization', 'tokenInválido')
        .send({ ...payloadRecipe });
    });

    it('Retorna um código de status "401"', () => {
      expect(response).to.have.status(401);
    });

    it('Retorna um objeto', () => {
      expect(response).to.have.be.an('object');
    });

    it('Retorna o objeto possui o atributo message com a mensagem "jwt malformed"', () => {
      expect(response.body.message).to.be.equal('jwt malformed');
    });
  });

  describe('Quando a receita é inválida', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .post(RECIPE_URI)
        .set('Authorization', tokenMock)
        .send({ ...payloadRecipe, name: '' });
    });

    it('Retorna um código de status "400"', () => {
      expect(response).to.have.status(400);
    });

    it('Retorna um objeto', () => {
      expect(response).to.have.be.an('object');
    });

    it('Retorna o objeto possui o atributo message com a mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('Quando a receita é criada com sucesso', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post(RECIPE_URI)
        .set('Authorization', tokenMock)
        .send({ ...payloadRecipe });
    });

    after(async () => {
      await connectionMock.db('Cookmaster')
      .collection('recipes')
      .deleteMany({});
    });

    it('Retorna um código de status "201"', () => {
      expect(response).to.have.status(201);
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.have.be.an('object');
    });

    it('O objeto ser igual ao objeto passado', () => {
    expect(response.body.recipe).to.have.all.keys('_id', 'name', 'ingredients', 'preparation', 'userId')    });
  });
});
