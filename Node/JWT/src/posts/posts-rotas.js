const postsControlador = require('./posts-controlador');
const { middlewaresAutenticacao } = require('../usuarios');

module.exports = app => {
  app
    .route('/post')
    .get(postsControlador.lista)
    .post(
      middlewaresAutenticacao.bearer,
      postsControlador.adiciona
    );
};

/*

Modulo ES

import { lista, adiciona } from './posts-controlador';
import { middlewaresAutenticacao } from '../usuarios';

export default app => {
  app
    .route('/post')
    .get(lista)
    .post(
      middlewaresAutenticacao.bearer,
      adiciona
    );
};


*/