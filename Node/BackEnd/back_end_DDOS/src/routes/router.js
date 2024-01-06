import { Router } from "express";
import Controller from "../controllers/controller.js"
const router = Router();
const controller = new Controller();
router.post('/login', controller.login);
router.get('/users', controller.getAllUsers);

export default router;