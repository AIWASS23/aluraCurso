const posts = require('./src/posts');
const usuarios = require('./src/usuarios');

module.exports = app => {
  app.get('/', (req, res) => {res.send('Olá pessoa!')});
  
  posts.rotas(app);
  usuarios.rotas(app);
};

/*

Modulo ES

import { rotas } from './src/posts';
import { rotas as _rotas } from './src/usuarios';

export default app => {
  app.get('/', (req, res) => {res.send('Olá pessoa!')});
  
  rotas(app);
  _rotas(app);
};

*/