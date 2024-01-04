const { InvalidArgumentError } = require('./erros');

module.exports = {
  campoStringNaoNulo: (valor, nome) => {
    if (typeof valor !== 'string' || valor === 0)
      throw new InvalidArgumentError(`É necessário preencher o campo ${nome}!`);
  },

  campoTamanhoMinimo: (valor, nome, minimo) => {
    if (valor.length < minimo)
      throw new InvalidArgumentError(
        `O campo ${nome} precisa ser maior que ${minimo} caracteres!`
      );
  },

  campoTamanhoMaximo: (valor, nome, maximo) => {
    if (valor.length > maximo)
      throw new InvalidArgumentError(
        `O campo ${nome} precisa ser menor que ${maximo} caracteres!`
      );
  }
};

/*

Modulo ES

import { InvalidArgumentError } from './erros';


export function campoStringNaoNulo(valor, nome) {
  if (typeof valor !== 'string' || valor === 0)
    throw new InvalidArgumentError(`É necessário preencher o campo ${nome}!`);
}
export function campoTamanhoMinimo(valor, nome, minimo) {
  if (valor.length < minimo)
    throw new InvalidArgumentError(
      `O campo ${nome} precisa ser maior que ${minimo} caracteres!`
    );
}
export function campoTamanhoMaximo(valor, nome, maximo) {
  if (valor.length > maximo)
    throw new InvalidArgumentError(
      `O campo ${nome} precisa ser menor que ${maximo} caracteres!`
    );
}

*/
