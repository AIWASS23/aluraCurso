import cors from 'cors';
import express from 'express';
import router from './routes/router.js';

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use('/', router);
export default app;