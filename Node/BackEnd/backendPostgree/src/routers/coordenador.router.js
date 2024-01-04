import { Router } from 'express';

import CoordenadorController from '../controllers/coordenador.controller.js';
import validarUsuarioCoordenador from '../middlewares/validarUsuarioCoordenador.middleware.js';

const coordenadorController = new CoordenadorController();
const coordenadorRouter = Router();

coordenadorRouter.get('/cliente', coordenadorController.listarClientes);
coordenadorRouter.get('/clientes', coordenadorController.obterClientesNomeId);
coordenadorRouter.get('/cliente/:id', coordenadorController.exibirCliente);
coordenadorRouter.get('/medidor', coordenadorController.listarMedidores);
coordenadorRouter.get('/filtrar/clientes', coordenadorController.filtrarClientes);
coordenadorRouter.get('/medidor/:id', coordenadorController.exibirMedidor);
coordenadorRouter.get('/medidores/cliente/:id', coordenadorController.listarMedidoresCliente);

coordenadorRouter.post('/medidor/qrcode', coordenadorController.verificarQRCode);
coordenadorRouter.post('/cliente/logix', coordenadorController.consultarLogix);
coordenadorRouter.post('/cliente', coordenadorController.cadastrarCliente);
coordenadorRouter.post('/medidor', coordenadorController.cadastrarMedidor);

coordenadorRouter.patch('/cliente/:id', coordenadorController.editarCliente);
coordenadorRouter.patch('/medidor/:id', coordenadorController.editarMedidor);
coordenadorRouter.patch('/cliente/arquivar/:id', validarUsuarioCoordenador(), coordenadorController.arquivarCliente);
coordenadorRouter.patch('/medidor/arquivar/:id', validarUsuarioCoordenador(), coordenadorController.arquivarMedidor);

export default coordenadorRouter;