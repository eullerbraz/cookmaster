const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const { expect } = chai;
const server = require('../api/app');
const getConnection = require('./mocks/connectionMock');

const USER_URI = '/users';
const payloadUser = {
  name: 'name',
  email: 'teste@email.com',
  password: 'password',
  role: 'user',
};


chai.use(chaiHttp);

describe('POST /users', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
    await connectionMock.db('Cookmaster')
    .collection('users')
    .deleteMany({});
  });

  describe('Quando o usuário é inválido', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .post(USER_URI)
        .send({ ...payloadUser, name: '' });
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

  describe('Quando o email já está cadastrado', () => {
    let response;

    before(async () => {
      await connectionMock.db('Cookmaster')
      .collection('users')
      .insertOne({ ...payloadUser });

      response = await chai.request(server)
        .post(USER_URI)
        .send(payloadUser);
    });

    after(async () => {
      await connectionMock.db('Cookmaster')
      .collection('users').deleteMany({});
    });

    it('Retorna um código de status "409"', () => {
      expect(response).to.have.status(409);
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.have.be.an('object');
    });

    it('O objeto possui o atributo message com a mensagem "Email already registered"', () => {
      expect(response.body.message).to.be.equal('Email already registered');
    });
  });

  describe('Quando o usuário é cadastrado com sucesso', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post(USER_URI)
        .send(payloadUser);
    });

    it('Retorna um código de status "201"', () => {
      expect(response).to.have.status(201);
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.have.be.an('object');
    });

    it('O objeto ser igual ao objeto passado', () => {
      expect(response.body.user).to.have.all.keys('_id', 'name', 'email', 'role');
    });
  });
});
