import { Router } from "express";
import usuarioModel from "../model/user_model.js";

const router = Router();

router.get('/', async (req, res) => {
    const {email, password} = req.body;
    const user = await usuarioModel.find(user => user.email === email);
    if (!user) {
        return res.status(404).send({message:"User not found"});
    }
    if (user.password === password) {
        console.log(user);
        return res.status(200).json({user: user});
    } 
    return res.status(400).send({message:"Invalid password"});
    
});

export default router;