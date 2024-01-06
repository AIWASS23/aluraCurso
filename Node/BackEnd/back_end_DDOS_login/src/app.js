import cors from 'cors';
import express from 'express';
import router from './routes/router.js';
import AutenticacaoMiddleware from './middleware/autenticacao_middleware.js';
import limiter from "./middleware/rateLimiter_middleware.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(AutenticacaoMiddleware);
app.use(limiter);
app.use('/', router);
export default app;