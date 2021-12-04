const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient, ObjectId } = require('mongodb');

const { expect } = chai;
const server = require('../api/app');
const getConnection = require('./mocks/connectionMock');
const getToken = require('./mocks/tokenMock');

const ID = '61aaa2e17ea86314e0da07f6';
const RECIPE_URI = `/recipes/${ID}/image`;
const image = `localhost:3000/src/uploads/${ID}.jpeg`;
const payloadRecipe = {
  _id: ObjectId(ID),
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

describe('PUT /recipes/:id/image', () => {
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
        .put(RECIPE_URI)
        .attach('image', path.resolve(__dirname,'../uploads/ratinho.jpg'), 'ratinho.jpg');
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
      .put(RECIPE_URI)
      .set('Authorization', 'tokenInválido')
      .attach('image', path.resolve(__dirname,'../uploads/ratinho.jpg'), 'ratinho.jpg');
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

  describe('Quando o id da receita é inválido', () => {
    let response;

    before(async () => {
      await connectionMock.db('Cookmaster')
      .collection('recipes')
      .insertOne({ ...payloadRecipe });

      response = await chai.request(server)
        .put('/recipes/idInvalido/image')
        .set('Authorization', tokenMock)
        .attach('image', path.resolve(__dirname,'../uploads/ratinho.jpg'), 'ratinho.jpg');
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
        .put(RECIPE_URI)
        .set('Authorization', tokenMock)
        .attach('image', path.resolve(__dirname,'../uploads/ratinho.jpg'), 'ratinho.jpg');
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

  describe('Quando a imagem é adicionada com sucesso', () => {
    let response;

    before(async () => {
      await connectionMock.db('Cookmaster')
      .collection('recipes')
      .insertOne({ ...payloadRecipe });

      response = await chai.request(server)
        .put(RECIPE_URI)
        .set('Authorization', tokenMock)
        .attach('image', path.resolve(__dirname,'../uploads/ratinho.jpg'), 'ratinho.jpg');
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

    it('O objeto ser igual ao objeto passado', () => {
    expect(response.body).to.have.all.keys('_id', 'name', 'ingredients', 'preparation', 'userId', 'image')    });
  });
});
