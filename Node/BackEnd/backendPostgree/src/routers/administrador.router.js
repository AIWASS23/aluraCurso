import { Router } from 'express';

import AdministradorController from '../controllers/administrador.controller.js';

import validacoesMiddleware from '../middlewares/validacoes.middleware.js';

import schemas from '../utils/validacoes.util.js';

const administradorRouter = Router();
const administradorController = new AdministradorController();

administradorRouter.get('/user', administradorController.listarUsuarios);
administradorRouter.get('/user/:id', administradorController.obterUsuario);
administradorRouter.get('/filtrar/usuarios', administradorController.filtrarUsuarios);

administradorRouter.post('/user', validacoesMiddleware(schemas.newUserSchema), administradorController.criarUsuario);

administradorRouter.patch('/user/:id', validacoesMiddleware(schemas.editUserSchema), administradorController.editarUsuario);
administradorRouter.patch('/user/archive/:id', administradorController.arquivarUsuario);
administradorRouter.patch('/user/block/:id', administradorController.bloquearUsuario);

administradorRouter.post('/login', administradorController.login);
administradorRouter.put('/editEmail/:id', validacoesMiddleware(schemas.verifyEmailSchema), administradorController.editarEmail);
administradorRouter.put('/editPassword/:id', validacoesMiddleware(schemas.verifyPasswordSchema), administradorController.editarSenha);

export default administradorRouter;