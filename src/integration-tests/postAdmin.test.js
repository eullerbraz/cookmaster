const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const { expect } = chai;
const server = require('../api/app');
const getConnection = require('./mocks/connectionMock');
const getToken = require('./mocks/tokenMock');

const ADMIN_URI = '/users/admin';
const payloadAdmin = {
  name: 'name',
  email: 'teste@email.com',
  password: 'password',
};


chai.use(chaiHttp);

describe('POST /users/admin', () => {
  let connectionMock;
  const tokenMockAdmin = getToken({ ...payloadAdmin, role: 'admin' });
  const tokenMockUser = getToken({ ...payloadAdmin, role: 'user' });

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

  describe('Quando não há token de autentificação', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
      .post(ADMIN_URI)
      .send(payloadAdmin);
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
        .post(ADMIN_URI)
        .set('Authorization', 'tokenInválido')
        .send(payloadAdmin);
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

  describe('Quando o usuário é inválido', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .post(ADMIN_URI)
        .set('Authorization', tokenMockAdmin)
        .send({ ...payloadAdmin, name: '' });
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
      .insertOne({ ...payloadAdmin });

      response = await chai.request(server)
        .post(ADMIN_URI)
        .set('Authorization', tokenMockAdmin)
        .send(payloadAdmin);
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

  describe('Quando o usuário não é admin', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post(ADMIN_URI)
        .set('Authorization', tokenMockUser)
        .send(payloadAdmin);
    });

    after(async () => {
      await connectionMock.db('Cookmaster')
      .collection('users').deleteMany({});
    });

    it('Retorna um código de status "403"', () => {
      expect(response).to.have.status(403);
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.have.be.an('object');
    });

    it('O objeto possui o atributo message com a mensagem "Only admins can register new admins"', () => {
      expect(response.body.message).to.be.equal('Only admins can register new admins');
    });
  });

  describe('Quando o admin é cadastrado com sucesso', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post(ADMIN_URI)
        .set('Authorization', tokenMockAdmin)
        .send(payloadAdmin);
    });

    it('Retorna um código de status "201"', () => {
      expect(response).to.have.status(201);
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.have.be.an('object');
    });

    it('O objeto ser igual ao objeto passado', () => {
      expect(response.body.user).to.have.all.keys('_id', 'name', 'email', 'role')
    });

    it('O atributo role deve ser igual a "admin"', () => {
      expect(response.body.user.role).to.be.equal('admin');
    });
  });
});
