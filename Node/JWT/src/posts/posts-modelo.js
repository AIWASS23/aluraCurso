const postsDao = require('./posts-dao');
const validacoes = require('../validacoes-comuns');

class Post {
  constructor(post) {
    this.titulo = post.titulo;
    this.conteudo = post.conteudo;
    this.valida();
  }

  adiciona() {
    return postsDao.adiciona(this);
  }

  valida() {
    validacoes.campoStringNaoNulo(this.titulo, 'título');
    validacoes.campoTamanhoMinimo(this.titulo, 'título', 5);

    validacoes.campoStringNaoNulo(this.conteudo, 'conteúdo');
    validacoes.campoTamanhoMaximo(this.conteudo, 'conteúdo', 140);
  }

  static lista() {
    return postsDao.lista();
  }
}

module.exports = Post;

/*

modulo ES

import { adiciona as _adiciona, lista as _lista } from './posts-dao';
import { campoStringNaoNulo, campoTamanhoMinimo, campoTamanhoMaximo } from '../validacoes-comuns';

class Post {
  constructor(post) {
    this.titulo = post.titulo;
    this.conteudo = post.conteudo;
    this.valida();
  }

  adiciona() {
    return _adiciona(this);
  }

  valida() {
    campoStringNaoNulo(this.titulo, 'título');
    campoTamanhoMinimo(this.titulo, 'título', 5);

    campoStringNaoNulo(this.conteudo, 'conteúdo');
    campoTamanhoMaximo(this.conteudo, 'conteúdo', 140);
  }

  static lista() {
    return _lista();
  }
}

export default Post;

*/
