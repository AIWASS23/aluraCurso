import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import autenticacaoMiddleware from './middlewares/autenticacao.middleware.js';

import administradorRouter from './routers/administrador.router.js';
import leituristaRouter from './routers/leiturista.router.js';
import coordenadorRouter from './routers/coordenador.router.js';
import router from './routers/router.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(cors({
    origin: 'http://cegas.iticdigital.com.br',
    methods: ['GET', 'POST', 'PUT', 'PATCH']
}));

app.use(autenticacaoMiddleware);

app.use('/', router)
app.use('/admin', administradorRouter);
app.use('/reader', leituristaRouter);
app.use('/coordenador', coordenadorRouter);

app.use('/file/usuario', express.static(path.resolve(__dirname, "public", "images", "usuarios")));
app.use('/file/cliente', express.static(path.resolve(__dirname, "public", "images", "clientes")));
app.use('/file/leitura', express.static(path.resolve(__dirname, "public", "images", "leituras")));

export default app;