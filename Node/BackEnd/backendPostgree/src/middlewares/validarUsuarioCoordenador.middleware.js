import usuariosModel from "../models/usuarios.model.js";

const validarUsuarioCoordenador = () => async (req, res, next) => {
    try {
        const id_usuario =  req.headers['id-usuario'];

        if(!id_usuario) {
            return res.status(400).json({ erro: true, mensagem: "Você precisa indicar o campo id-usuario na header da requisição" });
        }

        // const login = await conexao('usuarios').select('id', 'categoria').where({ id: id_usuario }).first();
        const login = await usuariosModel.find(usuario => usuario.id === id_usuario);
        if(!login) {
            return res.status(404).json({ erro: true, mensagem: "Usuário logado não encontrado" });
        }

        if(!login.categoria.includes("Administrador") && !login.categoria.includes("Coordenador")) {
            return res.status(401).json({ erro: true, mensagem: "Você não tem permissão para acessar este recurso" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: error.message , error_path: error.path });
    }
}

export default validarUsuarioCoordenador;