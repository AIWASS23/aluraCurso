import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import leituristaModel from '../models/leiturista.model.js';
import loginModel from '../models/login.model.js';
import usuariosModel from '../models/usuarios.model.js';

import hashPassword from '../utils/hashPassword.util.js';
import enviarEmail from '../utils/enviarEmail.util.js';
import validacoesUtil from '../utils/validacoes.util.js';

const JWT_SECRET = process.env.JWT_SECRET;
class Controller {

    async homepage (req, res) {
        try {
            return res.status(200).json({ mensagem: "API Cegás está funcionando" });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async login (req, res) {
        try {
            const { email, senha } = req.body;

            const erroCamposObrigatorios = await validacoesUtil.allFieldsRequired({ email, senha });
            if(erroCamposObrigatorios) {
                return res.status(400).json({ mensagem: erroCamposObrigatorios });
            }

            const erros = {
                erro_email: await validacoesUtil.isValidEmail(email),
                erro_senha: await validacoesUtil.isValidPassword(senha)
            }
            if((erros.erro_email || erros.erro_senha) && email !== "admin") {
                return res.status(400).json({
                    mensagem: {
                        erro_email: erros.erro_email,
                        erro_senha: erros.erro_senha
                    }
                });
            }

            const usuarioEncontrado = await usuariosModel.find(usuario => usuario.email === email);
            if(!usuarioEncontrado) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }

            if(usuarioEncontrado.situacao === "Bloqueado") {
                return res.status(401).json({ mensagem: "Você não tem permissão para acessar o sistema" });
            }

            if(usuarioEncontrado.email === "admin" && senha === "admin123") {
                usuarioEncontrado.senha = await hashPassword(senha);
            }

            if(bcrypt.compareSync(senha, usuarioEncontrado.senha)) {
                const token = jsonwebtoken.sign(usuarioEncontrado, JWT_SECRET, {
                    expiresIn: 60 * 60  * 10 // 10h
                });
                
                if(loginModel.length > 0) {
                    await loginModel.pop();
                }

                await loginModel.push(usuarioEncontrado);
                return res.status(200).json({
                    auth: true,
                    id: usuarioEncontrado.id,
                    nome: usuarioEncontrado.nome,
                    email: usuarioEncontrado.email,
                    telefone: usuarioEncontrado.telefone,
                    categoria: usuarioEncontrado.categoria,
                    situacao: usuarioEncontrado.situacao,
                    imagem_url: usuarioEncontrado.imagem_url, 
                    token: token,
                    mensagem: "Online"
                });
            }
            return res.status(400).json({ mensagem: "Senha inválida" });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async recuperarSenha (req, res) {
        try {
            const { email } = req.body;
    
            const usuarioEncontrado = await usuariosModel.find(usuario => usuario.email === email);
            if(!usuarioEncontrado) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
    
            const erroEnviarEmail = await enviarEmail.recoverPasswordEmail(email, usuarioEncontrado.id);
            if(erroEnviarEmail) {
                return res.status(500).json({ erro: true, mensagem: "Erro ao enviar o email de recuperação de senha" });
            }
    
            res.status(200).json({ mensagem: `Email enviado para ${email}` });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async editarEmail (req,res) {
        try {
            const { id } = req.params;
            const { email } = req.body;
    
            const usuarioEncontrado = await usuariosModel.find(usuario => usuario.id === id);
            if(!usuarioEncontrado) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
    
            if(usuarioEncontrado.situacao === 'Aguardando confirmação') {
                return res.status(400).json({ mensagem: "Não é possível editar o email. Por favor, faça a confirmação da sua conta" });
            }
    
            const emailEncontrado = await usuariosModel.findIndex(usuario => usuario.email === email);
            if(emailEncontrado !== -1) {
                return res.status(400).json({ mensagem: "Este email já está em uso" });
            }
    
            enviarEmail.editEmail(email, usuarioEncontrado.id);
            return res.status(200).json({ mensagem: `Email enviado para ${email}` });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async editarSenha (req, res) {
        try {
            const { id } = req.params;
            const { senha, nova_senha, confirmar_senha } = req.body;
    
            const usuarioEncontrado = await usuariosModel.find(usuario => usuario.id === id);
            if(!usuarioEncontrado) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
    
            if(!senha) {
                return res.status(400).json({ mensagem: "Senha é um campo obrigatório" });
            }

            if(nova_senha !== confirmar_senha) {
                return res.status(400).json({ mensagem: "As senhas não coincidem" });
            }
    
            if(bcrypt.compareSync(senha, usuarioEncontrado.senha)) {
                usuarioEncontrado.senha = await hashPassword(nova_senha);
                return res.status(200).json({ mensagem: "Senha alterada com sucesso" });
            }
    
            return res.status(400).json({ mensagem: "Senha incorreta" });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async verificarConta (req, res) {
        try {
            const { id } = req.params;
            const { nova_senha, confirmar_senha} = req.body;
    
            const usuarioEncontrado = await usuariosModel.find(usuario => usuario.id === id);
            if(!usuarioEncontrado) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }

            if(nova_senha !== confirmar_senha) {
                return res.status(400).json({ mensagem: "As senhas não coincidem" });
            }
    
            usuarioEncontrado.senha = await hashPassword(nova_senha);
            usuarioEncontrado.situacao === "Aguardando confirmação" && (usuarioEncontrado.situacao = "Ativo");
            return res.status(200).json({ mensagem: "Senha criada com sucesso" });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
        
    }

    async verificarNovoEmail (req, res) {
        try {
            const { id } = req.params;
            const { email } = req.body;
            
            const usuarioEncontrado = await usuariosModel.find(usuario => usuario.id === id);
            if(!usuarioEncontrado) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
    
            const emailEncontrado = await usuariosModel.findIndex(usuario => usuario.email === email);
            if(emailEncontrado !== -1) {
                return res.status(400).json({ mensagem: "Este email já está em uso" });
            }
    
            usuarioEncontrado.email = email;
            return res.status(200).json({ mensagem: "Email alterado com sucesso" });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
        
    }

    async exibirPerfilUsuario (req, res) {
        try {
            const usuario = await loginModel[0];
    
            if(!usuario) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
    
            const { senha, ...usuarioSemSenha } = usuario;
            return res.status(200).json({ usuario: usuarioSemSenha });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async exibirDashboard (req, res) {
        try {
            const leituras = await leituristaModel;

            // Leituras aguardando processamento, com um mostrador numérico contendo o total de leituras pendentes de sincronização.
            const leiturasPendentesSincronizacao = 0;
            
            // Leituras pendentes de análise pelo coordenador, com mostradores numéricos contendo os totais de 
            // (a) leituras não sincronizadas, 
            // (b) suspeita de erro no registro e 
            // (c) erro de sincronização
            const leiturasNaoSincronizadas = 0;
            const leiturasSuspeitasErro = leituras.possiveis_erros.length;
            const leiturasErroSincronizacao = 0;

    
            return res.status(200).json({
                leituras_pendentes_sincronizacao: leiturasPendentesSincronizacao,
                leituras_nao_sincronizadas: leiturasNaoSincronizadas,
                leituras_suspeitas_erro: leiturasSuspeitasErro,
                leituras_erro_sincronizacao: leiturasErroSincronizacao
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async extratoLeituras (req, res) {
        
        const leituras = await leituristaModel.todas
            .reduce((groups, item) => ({
                ...groups,
                [item.data]: [...(groups[item.data] || []), item.id]
            }), {});
        
        return res.status(200).json({ extrato: leituras })
    }

    async imagemUpload (req, res) {
        
        try {
            
            if(req.file){
                return res.json({
                    erro: false,
                    mensagem: "Upload realizado com sucesso"
               });
            }

            return res.status(400).json({
                erro: true,
                mensagem:"upload não foi realizado"
        
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async listarImagensUsuarios (req, res) {
        try {
            
            const directoryPath = path.join('src/public/images/usuarios');
            const imagemUrl = '/file/'
            const imagens = [];

            fs.readdir(directoryPath, function (err, files) {
                if (err) {
                    return res.status(404).json({ mensagem: "Não foi possível encontrar o caminho para as imagens" });
                } 
                files.forEach(function (file) {
                    imagens.push(imagemUrl.concat(file));
                });
                return res.status(200).json({ imagens });
            });

            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }
}

export default Controller; 