const usuariosDao = require('./usuarios-dao');
const { InvalidArgumentError } = require('../erros');
const validacoes = require('../validacoes-comuns');
const bcrypt = require('bcrypt');

class Usuario {
  constructor(usuario) {
    this.id = usuario.id;
    this.nome = usuario.nome;
    this.email = usuario.email;
    this.senhaHash = usuario.senhaHash;

    this.valida();
  }

  async adiciona() {
    if (await Usuario.buscaPorEmail(this.email)) {
      throw new InvalidArgumentError('O usuário já existe!');
    }

    return usuariosDao.adiciona(this);
  }

  async adicionaSenha(senha) {
    validacoes.campoStringNaoNulo(senha, 'senha');
    validacoes.campoTamanhoMinimo(senha, 'senha', 8);
    validacoes.campoTamanhoMaximo(senha, 'senha', 64);

    this.senhaHash = await Usuario.gerarSenhaHash(senha);
  }

  valida() {
    validacoes.campoStringNaoNulo(this.nome, 'nome');
    validacoes.campoStringNaoNulo(this.email, 'email');
  }

  async deleta() {
    return usuariosDao.deleta(this);
  }

  static async buscaPorId(id) {
    const usuario = await usuariosDao.buscaPorId(id);
    if (!usuario) {
      return null;
    }

    return new Usuario(usuario);
  }

  static async buscaPorEmail(email) {
    const usuario = await usuariosDao.buscaPorEmail(email);
    if (!usuario) {
      return null;
    }

    return new Usuario(usuario);
  }

  static lista() {
    return usuariosDao.lista();
  }

  static gerarSenhaHash(senha) {
    const custoHash = 12;
    return bcrypt.hash(senha, custoHash);
  }
}

module.exports = Usuario;

/*

Modulo ES

import { adiciona as _adiciona, deleta as _deleta, buscaPorId as _buscaPorId, buscaPorEmail as _buscaPorEmail, lista as _lista } from './usuarios-dao';
import { InvalidArgumentError } from '../erros';
import { campoStringNaoNulo, campoTamanhoMinimo, campoTamanhoMaximo } from '../validacoes-comuns';
import { hash } from 'bcrypt';

class Usuario {
  constructor(usuario) {
    this.id = usuario.id;
    this.nome = usuario.nome;
    this.email = usuario.email;
    this.senhaHash = usuario.senhaHash;

    this.valida();
  }

  async adiciona() {
    if (await Usuario.buscaPorEmail(this.email)) {
      throw new InvalidArgumentError('O usuário já existe!');
    }

    return _adiciona(this);
  }

  async adicionaSenha(senha) {
    campoStringNaoNulo(senha, 'senha');
    campoTamanhoMinimo(senha, 'senha', 8);
    campoTamanhoMaximo(senha, 'senha', 64);

    this.senhaHash = await Usuario.gerarSenhaHash(senha);
  }

  valida() {
    campoStringNaoNulo(this.nome, 'nome');
    campoStringNaoNulo(this.email, 'email');
  }

  async deleta() {
    return _deleta(this);
  }

  static async buscaPorId(id) {
    const usuario = await _buscaPorId(id);
    if (!usuario) {
      return null;
    }

    return new Usuario(usuario);
  }

  static async buscaPorEmail(email) {
    const usuario = await _buscaPorEmail(email);
    if (!usuario) {
      return null;
    }

    return new Usuario(usuario);
  }

  static lista() {
    return _lista();
  }

  static gerarSenhaHash(senha) {
    const custoHash = 12;
    return hash(senha, custoHash);
  }
}

export default Usuario;


*/
