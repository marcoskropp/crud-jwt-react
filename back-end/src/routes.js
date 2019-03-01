const express = require('express');
let middleware = require('./middlewares/jwt');

const routes = express.Router();

const UserController = require('./controllers/UserController');
const LoginController = require('./controllers/LoginController');

routes.get('/user', middleware.checkToken, UserController.index);
routes.get('/user/:id', middleware.checkToken, UserController.showUser);
routes.get('/users/:search', middleware.checkToken, UserController.show);

routes.delete('/user/:id', middleware.checkToken, UserController.destroy);
routes.put('/user/:id',middleware.checkToken, UserController.update);
routes.post('/user', UserController.store);
routes.post('/login', LoginController.login);

module.exports = routes;
