import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import usuarioModel from '../model/user_model.js';

class Controller {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const usuarioEncontrado = await usuarioModel.find(usuario => usuario.email === email);
            if (!usuarioEncontrado) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
            if (password != usuarioEncontrado.password) {
                console.log(usuarioEncontrado.password)
                return res.status(404).json({ mensagem: "Senha incorreta" });
            }
            const token = jsonwebtoken.sign(usuarioEncontrado, "secret", { expiresIn: 60 * 60 * 10 /* 10h*/ });
            console.log(token);
            return res.status(200).json({message:"Login feito com sucesso"});
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async getAllUsers(req, res) {
        return res.status(200).json({ usuarios: usuarioModel });
    }
}

export default Controller;