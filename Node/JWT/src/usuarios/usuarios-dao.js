const db = require('../../database');
const { InternalServerError } = require('../erros');

module.exports = {
  adiciona: usuario => {
    return new Promise((resolve, reject) => {
      db.run(
        `
          INSERT INTO usuarios (
            nome,
            email,
            senhaHash
          ) VALUES (?, ?, ?)
        `,
        [usuario.nome, usuario.email, usuario.senhaHash],
        erro => {
          if (erro) {
            reject(new InternalServerError('Erro ao adicionar o usuário!'));
          }

          return resolve();
        }
      );
    });
  },

  buscaPorId: id => {
    return new Promise((resolve, reject) => {
      db.get(
        `
          SELECT *
          FROM usuarios
          WHERE id = ?
        `,
        [id],
        (erro, usuario) => {
          if (erro) {
            return reject('Não foi possível encontrar o usuário!');
          }

          return resolve(usuario);
        }
      );
    });
  },

  buscaPorEmail: email => {
    return new Promise((resolve, reject) => {
      db.get(
        `
          SELECT *
          FROM usuarios
          WHERE email = ?
        `,
        [email],
        (erro, usuario) => {
          if (erro) {
            return reject('Não foi possível encontrar o usuário!');
          }

          return resolve(usuario);
        }
      );
    });
  },

  lista: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `
          SELECT * FROM usuarios
        `,
        (erro, usuarios) => {
          if (erro) {
            return reject('Erro ao listar usuários');
          }
          return resolve(usuarios);
        }
      );
    });
  },

  deleta: usuario => {
    return new Promise((resolve, reject) => {
      db.run(
        `
          DELETE FROM usuarios
          WHERE id = ?
        `,
        [usuario.id],
        erro => {
          if (erro) {
            return reject('Erro ao deletar o usuário');
          }
          return resolve();
        }
      );
    });
  }
};

/*

Modulo ES

import { run, get, all } from '../../database';
import { InternalServerError } from '../erros';

export function adiciona(usuario) {
  return new Promise((resolve, reject) => {
    run(
      `
          INSERT INTO usuarios (
            nome,
            email,
            senhaHash
          ) VALUES (?, ?, ?)
        `,
      [usuario.nome, usuario.email, usuario.senhaHash],
      erro => {
        if (erro) {
          reject(new InternalServerError('Erro ao adicionar o usuário!'));
        }

        return resolve();
      }
    );
  });
}
export function buscaPorId(id) {
  return new Promise((resolve, reject) => {
    get(
      `
          SELECT *
          FROM usuarios
          WHERE id = ?
        `,
      [id],
      (erro, usuario) => {
        if (erro) {
          return reject('Não foi possível encontrar o usuário!');
        }

        return resolve(usuario);
      }
    );
  });
}
export function buscaPorEmail(email) {
  return new Promise((resolve, reject) => {
    get(
      `
          SELECT *
          FROM usuarios
          WHERE email = ?
        `,
      [email],
      (erro, usuario) => {
        if (erro) {
          return reject('Não foi possível encontrar o usuário!');
        }

        return resolve(usuario);
      }
    );
  });
}
export function lista() {
  return new Promise((resolve, reject) => {
    all(
      `
          SELECT * FROM usuarios
        `,
      (erro, usuarios) => {
        if (erro) {
          return reject('Erro ao listar usuários');
        }
        return resolve(usuarios);
      }
    );
  });
}
export function deleta(usuario) {
  return new Promise((resolve, reject) => {
    run(
      `
          DELETE FROM usuarios
          WHERE id = ?
        `,
      [usuario.id],
      erro => {
        if (erro) {
          return reject('Erro ao deletar o usuário');
        }
        return resolve();
      }
    );
  });
}

*/