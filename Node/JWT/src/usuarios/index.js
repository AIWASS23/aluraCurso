module.exports = {
  rotas: require('./usuarios-rotas'),
  controlador: require('./usuarios-controlador'),
  modelo: require('./usuarios-modelo'),
  estrategiasAutenticacao: require('./estrategias-autenticacao'),
  middlewaresAutenticacao: require('./middlewares-autenticacao')
};

/*

modulo ES

export const rotas = require('./usuarios-rotas');
export const controlador = require('./usuarios-controlador');
export const modelo = require('./usuarios-modelo');
export const estrategiasAutenticacao = require('./estrategias-autenticacao');
export const middlewaresAutenticacao = require('./middlewares-autenticacao');

*/