const usuariosControlador = require('./usuarios-controlador');
const middlewaresAutenticacao = require('./middlewares-autenticacao');

module.exports = app => {
  app
    .route('/usuario/login')
    .post(middlewaresAutenticacao.local, usuariosControlador.login);

  app
    .route('/usuario/logout')
    .get(middlewaresAutenticacao.bearer, usuariosControlador.logout);

  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app
    .route('/usuario/:id')
    .delete(middlewaresAutenticacao.bearer, usuariosControlador.deleta);
};

/*

Modulo ES

import { login, logout, adiciona, lista, deleta } from './usuarios-controlador';
import { local, bearer } from './middlewares-autenticacao';

export default app => {
  app
    .route('/usuario/login')
    .post(local, login);

  app
    .route('/usuario/logout')
    .get(bearer, logout);

  app
    .route('/usuario')
    .post(adiciona)
    .get(lista);

  app
    .route('/usuario/:id')
    .delete(bearer, deleta);
};


*/

