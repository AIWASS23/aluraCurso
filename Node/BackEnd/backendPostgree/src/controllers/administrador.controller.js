import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import Controller from './controller.js';

import conexao from '../models/conexao.js';
import loginModel from '../models/login.model.js';
import usuariosModel from '../models/usuarios.model.js';
import clientesModel from '../models/coordenador.model.js';

import hashPassword from '../utils/hashPassword.util.js';
import enviarEmail from '../utils/enviarEmail.util.js';
import validacoesUtil from '../utils/validacoes.util.js';
class AdministradorController extends Controller {

    async listarUsuarios(req, res) {
        try {
            const { arquivado } = req.query;
    
            const usuarios = await usuariosModel;
    
            if(arquivado) {
                const usuariosArquivados = [];
                for(let usuario of usuarios) {
                    if(usuario.situacao === "Arquivado") {
                        const { senha, ...usuarioSemSenha } = usuario;
                        usuariosArquivados.push(usuarioSemSenha);
                    }
                }
                return res.status(200).json({ usuarios: usuariosArquivados });
            }
    
            const usuariosNaoArquivados = [];
            for(let usuario of usuarios) {
                if(usuario.situacao !== "Arquivado") {
                    const { senha, ...usuarioSemSenha } = usuario;
                    usuariosNaoArquivados.push(usuarioSemSenha);
                }
            }
            return res.status(200).json({ usuarios: usuariosNaoArquivados });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async filtrarUsuarios (req, res) {
        try {

            const { nome, arquivados } = req.query;

            if(arquivados) {
                const usuariosArquivados = await usuariosModel.filter(usuario => usuario.situacao === 'Arquivado' && usuario.nome.toLowerCase().includes(nome.toLowerCase().trim()));
                if(!usuariosArquivados || usuariosArquivados.length === 0)
                    return res.status(404).json({
                        mensagem: "A busca não retornou resultados",
                        usuarios: usuariosArquivados
                    });

                return res.status(200).json({ usuarios: usuariosArquivados });
            }
            
            const usuariosEncontrados = await usuariosModel.filter(usuario => usuario.situacao !== 'Arquivado' && usuario.nome.toLowerCase().includes(nome.toLowerCase().trim()));
            if(!usuariosEncontrados || usuariosEncontrados.length === 0)
                return res.status(404).json({
                    mensagem: "A busca não retornou resultados",
                    usuarios: usuariosEncontrados
                });

            return res.status(200).json({ usuarios: usuariosEncontrados });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async obterUsuario (req, res) {
        try {
            const { id } = req.params;
    
            const usuario = await usuariosModel.find(usuario => usuario.id === id);
            if(!usuario) {
                return res.status(404).json("Usuário não encontrado");
            }
    
            return res.status(200).json({ usuario });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async criarUsuario (req,res) {
        try {
            const { nome, email, telefone, categoria, imagem_url } = req.body;
    
            // const login = await loginModel[0];
            // if(!login.categoria.includes("Administrador")) {
            //     return res.status(401).json({ mensagem: "Você não tem permissão para acessar este recurso" });
            // }
    
            const emailEncontrado = await usuariosModel.findIndex(user => user.email === email);
            if(emailEncontrado !== -1) {
                return res.status(400).json({ mensagem: "Este email já está em uso" });
            }
    
            const senha = crypto.randomUUID().split("-")[0];
            const novoId = crypto.randomUUID();
    
            const novoUsuario = {
                id: novoId,
                nome,
                email,
                telefone,
                senha: await hashPassword(senha),
                categoria,
                imagem_url: imagem_url && email + "_" + imagem_url,
                categoria,
                situacao: "Aguardando confirmação"
            };

            await usuariosModel.push(novoUsuario);

            // const novoUsuarioBD = await conexao('usuarios').insert({
            //     id: novoId,
            //     nome: nome,
            //     email: email,
            //     telefone: telefone,
            //     categoria:  categoria,
            //     situacao: "Aguardando confirmação",
            //     senha:  await hashPassword(password)
            // });
    
            const erroEnviarEmail = await enviarEmail.confirmRegistration(email, novoId);
            if(erroEnviarEmail) {
                return res.status(500).json({ erro: true, mensagem: "Erro ao enviar o email de confirmação" });
            }

            return res.status(201).json({ mensagem: "Usuário criado com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async editarUsuario (req, res) {
        try {
            const { id } = req.params;
            const { nome, email, telefone, categoria, imagem_url } = req.body;
    
            const login = await loginModel[0];
            if(!login.categoria.includes("Administrador")) {
                return res.status(401).json({ mensagem: "Você não tem permissão para acessar este recurso" });
            }
    
            const usuarioEncontrado = await usuariosModel.find(user => user.id === id);
            if(!usuarioEncontrado) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
    
            if(email && email !== 'admin') {
                const erroEmail = await validacoesUtil.isValidEmail(email);
                if(erroEmail) {
                    return res.status(400).json({ mensagem: erroEmail });
                }
    
                if(usuarioEncontrado.situacao !== "Aguardando confirmação") {
                    return res.status(400).json({ mensagem: "Não é possível alterar o email. Esta conta já foi confirmada" });
                }
    
                const emailEncontrado = await usuariosModel.findIndex(user => user.email === email);
                if(emailEncontrado !== -1) {
                    return res.status(400).json({ mensagem: "Este email já está em uso" });
                }
    
                usuarioEncontrado.email = email;
                const erroEnviarEmail = await enviarEmail.newUserEmailChanged(email, usuarioEncontrado.id);
                if(erroEnviarEmail) {
                    return res.status(500).json({ erro: true, mensagem: "Erro ao enviar o email de alteração no email cadastrado" });
                }
            }
    
            if(nome) {
                usuarioEncontrado.nome = nome;
            }
    
            if(telefone) {
                usuarioEncontrado.telefone = telefone;
            }
    
            if(categoria) {
                usuarioEncontrado.categoria = categoria;
            }
    
            if(imagem_url) {

                if (usuarioEncontrado.imagem_url) {
                    const directoryPath = path.join('src/public/images/usuarios/');
                    const imagemPath = `${directoryPath}${usuarioEncontrado.imagem_url}`;
                    fs.unlink(imagemPath, err => {
                        if(err) {
                            console.error(err);
                            return res.status(400).json({ mensagem: "Erro ao fazer o upload da imagem" });
                        }
                    });
                }

                email ? 
                    usuarioEncontrado.imagem_url = `${email}_${imagem_url}` : 
                    usuarioEncontrado.imagem_url = `${usuarioEncontrado.email}_${imagem_url}`;
            }
    
            return res.status(200).json({ mensagem: "Usuário editado com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async arquivarUsuario (req, res) {
        try {
            const { id } = req.params;
    
            const login = await loginModel[0];
            if(!login.categoria.includes("Administrador")) {
                return res.status(401).json({ mensagem: "Você não tem permissão para acessar este recurso" });
            }
    
            const usuarioEncontrado = await usuariosModel.find(user => user.id === id);
            if(!usuarioEncontrado) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
    
            usuarioEncontrado.situacao === "Arquivado" ? usuarioEncontrado.situacao = "Ativo" : usuarioEncontrado.situacao = "Arquivado";
            const erroEnviarEmail = await enviarEmail.archiveUserEmail(usuarioEncontrado);
            if(erroEnviarEmail) {
                return res.status(500).json({ erro: true, mensagem: "Erro ao enviar o email de arquivamento do usuário" });
            }
    
            if(usuarioEncontrado.situacao === "Arquivado") {
                return res.status(200).json({ mensagem: "Usuário arquivado com sucesso" });
            } 
    
            return res.status(200).json({ mensagem: "Usuário desarquivado com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async bloquearUsuario (req, res) {
        try {
            const { id } = req.params;
    
            const login = await loginModel[0];
            if(!login.categoria.includes("Administrador")) {
                return res.status(401).json({ mensagem: "Você não tem permissão para acessar este recurso" });
            }
    
            const usuarioEncontrado = await usuariosModel.find(user => user.id === id);
            if(!usuarioEncontrado) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
    
            usuarioEncontrado.situacao === "Bloqueado" ? usuarioEncontrado.situacao = "Ativo" : usuarioEncontrado.situacao = "Bloqueado";
            const erroEnviarEmail = await enviarEmail.blockUserEmail(usuarioEncontrado);
            if(erroEnviarEmail) {
                return res.status(500).json({ erro: true, mensagem: "Erro ao enviar o email de bloqueio de usuário" });
            }
            
            if(usuarioEncontrado.situacao === "Bloqueado") {
                return res.status(200).json({ mensagem: "Usuário bloqueado com sucesso" });
            } 
    
            return res.status(200).json({ mensagem: "Usuário desbloqueado com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

}

export default AdministradorController;