const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./controllers/users/router');
const recipeRouter = require('./controllers/recipes/router');
const { login } = require('./controllers/users');
const error = require('./middlewares/error');

const app = express();

app.use(bodyParser.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/users', userRouter);

app.use('/login', login);

app.use('/recipes', recipeRouter);

app.use('/images', express.static(path.resolve(__dirname, '../uploads')));

app.use(error);

module.exports = app;
