const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const { expect } = chai;
const server = require('../api/app');
const getConnection = require('./mocks/connectionMock');

const LOGIN_URI = '/login';
const payloadLogin = {
  email: 'teste@email.com',
  password: 'password',
};
const payloadUser = {
  name: 'name',
  email: 'teste@email.com',
  password: 'password',
  role: 'user',
};

chai.use(chaiHttp);

describe('POST /login', () => {
  before(async () => {
    connectionMock = await getConnection();

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('Quando o login é inválido', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .post(LOGIN_URI)
        .send({ ...payloadLogin, email: '' });
    });

    it('Retorna um código de status "401"', () => {
      expect(response).to.have.status(401);
    });

    it('Retorna um objeto', () => {
      expect(response).to.have.be.an('object');
    });

    it('Retorna o objeto possui o atributo message com a mensagem "All fields must be filled"', () => {
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('Quando o email não é encontrado', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post(LOGIN_URI)
        .send(payloadLogin);
    });

    it('Retorna um código de status "401"', () => {
      expect(response).to.have.status(401);
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.have.be.an('object');
    });

    it('O objeto possui o atributo message com a mensagem "Incorrect username or password"', () => {
      expect(response.body.message).to.be.equal('Incorrect username or password');
    });
  });

  describe('Quando o login é efetuado com sucesso', () => {
    let response;

    before(async () => {
      await connectionMock.db('Cookmaster')
      .collection('users')
      .insertOne({ ...payloadUser });

      response = await chai.request(server)
        .post(LOGIN_URI)
        .send(payloadLogin);
    });

    after(async () => {
      await connectionMock.db('Cookmaster')
      .collection('users').deleteMany({});
    });

    it('Retorna um código de status "200"', () => {
      expect(response).to.have.status(200);
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.have.be.an('object');
    });

    it('O objeto possui uma atributo token', () => {
    expect(response.body).to.have.key('token');
    });
  });
});
