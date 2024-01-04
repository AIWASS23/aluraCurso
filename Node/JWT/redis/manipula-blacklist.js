const blacklist = require('./blacklist');

const { promisify } = require('util');
const existsAsync = promisify(blacklist.exists).bind(blacklist);
const setAsync = promisify(blacklist.set).bind(blacklist);

const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');

function geraTokenHash(token) {
  return createHash('sha256')
    .update(token)
    .digest('hex');
}

module.exports = {
  adiciona: async token => {
    const dataExpiracao = jwt.decode(token).exp;
    const tokenHash = geraTokenHash(token);
    await setAsync(tokenHash, '');
    blacklist.expireat(tokenHash, dataExpiracao);
  },
  contemToken: async token => {
    const tokenHash = geraTokenHash(token);
    const resultado = await existsAsync(tokenHash);
    return resultado === 1;
  }
};

/*

módulo ES

import blacklist, { exists, set, expireat } from './blacklist';

import { promisify } from 'util';
const existsAsync = promisify(exists).bind(blacklist);
const setAsync = promisify(set).bind(blacklist);

import { decode } from 'jsonwebtoken';
import { createHash } from 'crypto';

function geraTokenHash(token) {
  return createHash('sha256')
    .update(token)
    .digest('hex');
}

export async function adiciona(token) {
  const dataExpiracao = decode(token).exp;
  const tokenHash = geraTokenHash(token);
  await setAsync(tokenHash, '');
  expireat(tokenHash, dataExpiracao);
}
export async function contemToken(token) {
  const tokenHash = geraTokenHash(token);
  const resultado = await existsAsync(tokenHash);
  return resultado === 1;
}

*/
