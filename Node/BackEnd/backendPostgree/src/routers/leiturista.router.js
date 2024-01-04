import { Router } from "express";

import LeituristaController from "../controllers/leiturista.controller.js";

import validacoesMiddleware from "../middlewares/validacoes.middleware.js";

import schemas from "../utils/validacoes.util.js";

const leituristaController = new LeituristaController();
const leituristaRouter = Router();

leituristaRouter.get('/sync', leituristaController.sincronizar);
leituristaRouter.get('/reading', leituristaController.listarLeiturasTodas);
leituristaRouter.get('/reading/today', leituristaController.listarLeiturasHoje);
leituristaRouter.get('/leitura/:id', leituristaController.obterLeitura);

leituristaRouter.post('/login', leituristaController.login);
leituristaRouter.post('/reading', validacoesMiddleware(schemas.verifyLeituraSchema), leituristaController.cadastrarLeitura);
leituristaRouter.post('/verifyReading', leituristaController.verificarLeitura);

leituristaRouter.put('/editEmail/:id', validacoesMiddleware(schemas.verifyEmailSchema), leituristaController.editarEmail);
leituristaRouter.put('/editPassword/:id', validacoesMiddleware(schemas.verifyPasswordSchema), leituristaController.editarSenha);
leituristaRouter.put('/reading/:id', leituristaController.editarLeitura);

leituristaRouter.patch('/leitura/arquivar/:id', leituristaController.arquivarLeitura);


export default leituristaRouter;