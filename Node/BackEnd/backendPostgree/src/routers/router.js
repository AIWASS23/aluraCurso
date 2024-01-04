import { Router } from "express";

import Controller from "../controllers/controller.js";

import validacoesMiddleware from "../middlewares/validacoes.middleware.js";
import uploadUsuario from "../middlewares/uploadImagemUsuario.middleware.js";
import uploadCliente from "../middlewares/uploadImagemCliente.middleware.js";
import uploadLeitura from "../middlewares/uploadImagemLeitura.middleware.js";

import schemas from '../utils/validacoes.util.js';

const router = Router();
const controller = new Controller();

const uploadImagemUsuario = uploadUsuario();
const uploadImagemCliente = uploadCliente();
const uploadImagemLeitura = uploadLeitura();

router.get('/', controller.homepage);
router.get('/extrato', controller.extratoLeituras);
router.get('/profile', controller.exibirPerfilUsuario);
router.get('/dashboard', controller.exibirDashboard);
router.get('/listImagens', controller.listarImagensUsuarios);

router.put('/verify/:id', validacoesMiddleware(schemas.verifyPasswordSchema), controller.verificarConta);
router.put('/verifyEmail/:id', validacoesMiddleware(schemas.verifyEmailSchema), controller.verificarNovoEmail);

router.post('/recoverPassword', validacoesMiddleware(schemas.verifyEmailSchema), controller.recuperarSenha);

router.post('/uploadImagem/usuario', uploadImagemUsuario.single("imagem"), controller.imagemUpload);
router.post('/uploadImagem/cliente', uploadImagemCliente.single("imagem"), controller.imagemUpload);
router.post('/uploadImagem/leitura', uploadImagemLeitura.single("imagem"), controller.imagemUpload);

export default router;