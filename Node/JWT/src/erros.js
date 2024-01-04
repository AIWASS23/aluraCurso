class InvalidArgumentError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'InvalidArgumentError';
  }
}

class InternalServerError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'InternalServerError';
  }
}

module.exports = {
  InvalidArgumentError: InvalidArgumentError,
  InternalServerError: InternalServerError
};

/*

Modulo ES

export const InvalidArgumentError = InvalidArgumentError;
export const InternalServerError = InternalServerError;

*/