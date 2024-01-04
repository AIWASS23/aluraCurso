import crypto from "crypto";
import fs from 'fs';
import path from 'path';

import Controller from "./controller.js";

import conexao from "../models/conexao.js";
import coordenadorModel from "../models/coordenador.model.js";
import loginModel from "../models/login.model.js";
import usuariosModel from "../models/usuarios.model.js";

class CoordenadorController extends Controller {

    async exibirCliente (req, res) {
        try {

            const { id } = req.params;

            const clienteEncontrado = await coordenadorModel.clientes.find(cliente => cliente.id === id);
            if(!clienteEncontrado) {
                return res.status(404).json({ mensagem: "Cliente não encontrado" });
            }

            return res.status(200).json({ cliente: clienteEncontrado });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async listarClientes (req, res) {
        try {            
            const clientes = await coordenadorModel.clientes;
            return res.status(200).json({ clientes });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async obterClientesNomeId(req, res) {
        try {
            const todosClientes = await coordenadorModel.clientes.filter(cliente => cliente.arquivado === false);
            if(todosClientes.length === 0) 
                return res.status(200).json({ erro: false, mensagem: "Nenhum cliente cadastrado" });
            
            const clientes = [];
            for(let cliente of todosClientes) {
                clientes.push({
                    id: cliente.id,
                    nome: cliente.nome
                });
            }

            return res.status(200).json({ erro: false, clientes });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async filtrarClientes (req, res) {
        try {

            const { nome, arquivados } = req.query;

            if(arquivados) {
                const clientesArquivados = await clientesModel.clientes.filter(cliente => cliente.arquivado && cliente.nome.toLowerCase().includes(nome.toLowerCase().trim()));
                if(!clientesArquivados || clientesArquivados.length === 0)
                    return res.status(404).json({ 
                        mensagem: "A busca não retornou resultados" ,
                        clientes: clientesArquivados
                    });
                
                return res.status(200).json({ clientes: clientesArquivados });
            }
            
            const clientesEncontrados = await clientesModel.clientes.filter(cliente => !cliente.arquivado && cliente.nome.toLowerCase().includes(nome.toLowerCase().trim()));
            if(!clientesEncontrados || clientesEncontrados.length === 0)
                return res.status(404).json({ 
                    mensagem: "A busca não retornou resultados" ,
                    clientes: clientesEncontrados
                });

            return res.status(200).json({ clientes: clientesEncontrados });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async cadastrarCliente (req, res) {
        try {
            const { nome, cnpj, logix, imagem_url } = req.body;
    
            const login = await loginModel[0];
            if(!login.categoria.includes("Administrador" || !login.categoria.includes("Coordenador"))) {
                return res.status(401).json({ mensagem: "Você não tem permissão para acessar este recurso" });
            }
    
            if(!nome) {
                return res.status(400).json({ mensagem: "O campo nome é obrigatório", error_path: "nome" });
            }
            if(!cnpj) {
                return res.status(400).json({ mensagem: "O campo cnpj é obrigatório", error_path: "cnpj" });
            }
            if(!logix) {
                return res.status(400).json({ mensagem: "O campo logix é obrigatório", error_path: "logix" });
            }
    
            const cnpjEncontrado = await coordenadorModel.clientes.findIndex(cliente => cliente.cnpj === cnpj);
            if(cnpjEncontrado !== -1) {
                return res.status(400).json({ mensagem: "cnpj já cadastrado", error_path: "cnpj" });
            }
    
            const logixEncontrado = await coordenadorModel.clientes.findIndex(cliente => cliente.logix === logix);
            if(logixEncontrado !== -1) {
                return res.status(400).json({ mensagem: "logix já cadastrado", error_path: "logix" });
            }
    
            const novoCliente = {
                id: crypto.randomUUID(),
                nome,
                cnpj,
                logix,
                arquivado: false,
                imagem_url: imagem_url && logix + "_" + imagem_url,
            }

            // const newClient = await conexao('clientes').insert({
            //     id: crypto.randomUUID(),
            //     nome: nome,
            //     cnpj: cnpj,
            //     logix: logix,
            //     arquivado: arquivado,
            // });
    
            coordenadorModel.clientes.push(novoCliente);
            return res.status(201).json({ mensagem: "Cliente cadastrado com sucesso", novo_cliente: novoCliente });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async editarCliente (req, res) {
        try {
            const { nome, cnpj, logix, imagem_url } = req.body;
            const { id } = req.params;
    
            const login = await loginModel[0];
            if(!login.categoria.includes("Administrador" || !login.categoria.includes("Coordenador"))) {
                return res.status(401).json({ mensagem: "Você não tem permissão para acessar este recurso" });
            }
    
            const clienteEncontrado = await coordenadorModel.clientes.find(cliente => cliente.id === id);
            if(!clienteEncontrado) {
                return res.status(404).json({ mensagem: "Cliente não encontrado" });
            }
    
            if(nome) {
                clienteEncontrado.nome = nome;
            }
            if(cnpj) {
                clienteEncontrado.cnpj = cnpj;
            }
            if(logix) {
                clienteEncontrado.logix = logix;
            }

            if(imagem_url) {
                if (clienteEncontrado.imagem_url) {
                    const directoryPath = path.join('src/public/images/clientes/');
                    const imagemPath = `${directoryPath}${clienteEncontrado.imagem_url}`;
                    fs.unlink(imagemPath, err => {
                        if(err) {
                            console.error(err);
                            return res.status(400).json({ mensagem: "Erro ao fazer o upload da imagem" });
                        }
                    });
                }

                logix ? 
                    clienteEncontrado.imagem_url = `${logix}_${imagem_url}` : 
                    clienteEncontrado.imagem_url = `${clienteEncontrado.logix}_${imagem_url}`;
            }
    
            return res.status(200).json({ mensagem: "Cliente alterado com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async listarMedidores (req, res) {
        try {
            const medidores = await coordenadorModel.medidores;
            return res.status(200).json({ medidores });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async exibirMedidor (req, res) {
        try {

            const { id } = req.params;

            const medidorEncontrado = await coordenadorModel.medidores.find(medidor => medidor.id === id);
            if(!medidorEncontrado) {
                return res.status(404).json({ mensagem: "Medidor não encontrado" });
            }

            return res.status(200).json({ medidor: medidorEncontrado });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async listarMedidoresCliente (req, res) {
        try {
            const { id } = req.params;

            const clienteEncontrado = await coordenadorModel.clientes.findIndex(cliente => cliente.id === id);
            if(clienteEncontrado === -1) {
                return res.status(404).json({ mensagem: "Cliente não encontrado" });
            }

            const todosMedidores = await coordenadorModel.medidores.filter(medidor => !medidor.arquivado && medidor.id_cliente === id);
            if(todosMedidores.length === 0) {
                return res.status(200).json({ mensagem: "Cliente não possui medidores cadastrados", medidores: todosMedidores });
            }
            
            return res.status(200).json({ mensagem: "Busca realizada com sucesso", medidores: todosMedidores });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async cadastrarMedidor (req, res) {
        try {
            const { 
                id_cliente,
                numero_serie,  
                gps,
                ultima_leitura, 
                qr_code,
                percentual_variacao, 
                ptz 
            } = req.body;

            if(!id_cliente) {
                return res.status(400).json({ mensagem: "O campo id_cliente é obrigatório" });
            }
            if(!ultima_leitura) {
                return res.status(400).json({ mensagem: "O campo ultima_leitura é obrigatório" });
            }
            if(!qr_code) {
                return res.status(400).json({ mensagem: "O campo qr_code é obrigatório" });
            }

            const numeroSerieEncontrado = await coordenadorModel.medidores.findIndex(medidor => medidor.numero_serie === numero_serie);
            if(numeroSerieEncontrado != -1) {
                return res.status(400).json({ mensagem: "Número de série já cadastrado" });
            }

            if(percentual_variacao < 0 || percentual_variacao > 100) {
                return res.status(400).json({ mensagem: "Valor inválido para percentual de variação. O valor deve ser um número entre 1 e 100" });
            }

            const clienteEncontrado = await coordenadorModel.clientes.find(cliente => cliente.id === id_cliente);
            if(!clienteEncontrado) {
                return res.status(404).json({ mensagem: "Cliente não encontrado. Certifique-se que o id_cliente está correto" });
            }
    
            const novoMedidor = {
                id: crypto.randomUUID(),
                id_cliente,
                nome_cliente: clienteEncontrado.nome,
                cnpj_cliente: clienteEncontrado.cnpj,
                numero_serie, 
                gps,
                ultima_leitura,
                qr_code,
                percentual_variacao: (percentual_variacao > 0) ? percentual_variacao/100 : 0.18,
                arquivado: false,
                ptz
            }
            coordenadorModel.medidores.push(novoMedidor);

            // const newMeter = await conexao('medidores').insert({
            //     id: crypto.randomUUID(),
            //     id_cliente: id_cliente,
            //     numero_serie: numero_serie,
            //     gps_latitude: gps_latitude,
            //     gps_longitude: gps_longitude,
            //     ultima_leitura: ultima_leitura,
            //     ptz: ptz,
            //     qr_code: qr_code,
            //     arquivado: arquivado,
            //     percentual_variacao: 0.18
            // });
    
            return res.status(201).json({ mensagem: "Novo medidor criado com sucesso", novo_medidor: novoMedidor });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async editarMedidor (req, res) {
        try {
            const { id } = req.params;
            const { id_cliente, numero_serie, ultima_leitura, qr_code, ptz, percentual_variacao } = req.body;
    
            const medidorEncontrado = await coordenadorModel.medidores.find(medidor => medidor.id === id);
            if(!medidorEncontrado) {
                return res.status(404).json({ mensagem: "Medidor não encontrado" });
            }

            if(id_cliente) {
                const clienteEncontrado = await coordenadorModel.clientes.find(cliente => cliente.id === id_cliente);
                if(!clienteEncontrado)
                    return res.status(404).json({ erro: true, mensagem: "Cliente não encontrado" });

                medidorEncontrado.id_cliente = id_cliente;
                medidorEncontrado.nome_cliente = clienteEncontrado.nome;
                medidorEncontrado.cnpj_cliente = clienteEncontrado.cnpj;
            }
            
            if(numero_serie) {
                medidorEncontrado.numero_serie = numero_serie;
            }

            if(ultima_leitura) {
                medidorEncontrado.ultima_leitura = ultima_leitura;
            }

            if(qr_code) {
                medidorEncontrado.qr_code = qr_code;
            }

            if(percentual_variacao) {
                if(percentual_variacao < 0 || percentual_variacao > 100) {
                    return res.status(400).json({ mensagem: "Valor inválido para percentual de variação. O valor deve ser um número entre 1 e 100" });
                }    

                medidorEncontrado.percentual_variacao = (percentual_variacao > 0) ? percentual_variacao/100 : 0.18;
            }

            if(ptz) {
                medidorEncontrado.ptz = ptz;
            }
    
            return res.status(200).json({ mensagem: "Medidor alterado com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async verificarQRCode (req, res) {
        try {
            
            const { qr_code } = req.body;

            if(!qr_code) {
                return res.status(400).json({ mensagem: "O campo qr_code é obrigatório", error_path: "qr_code" });  
            }

            const medidorEncontrado = await coordenadorModel.medidores.find(medidor => medidor.qr_code === qr_code);
            if(!medidorEncontrado) {
                return res.status(404).json({ mensagem: "Medidor não encontrado" });
            }

            return res.status(200).json({ medidor: medidorEncontrado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async consultarLogix (req, res) {
        try {
            const { logix } = req.body;

            const clienteEncontrado = await coordenadorModel.clientes.find(cliente => cliente.logix === logix);
            if(!clienteEncontrado) {
                return res.status(404).json({ mensagem: "Cliente não encontrado" });
            }

            const medidoresCliente = await coordenadorModel.medidores.filter(medidor =>  medidor.id_cliente === clienteEncontrado.id);
            return res.status(200).json({ cliente: clienteEncontrado, medidores: medidoresCliente });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async arquivarCliente (req, res) {
        try {

            const { id } = req.params;

            const clienteEncontrado = await coordenadorModel.clientes.find(cliente => cliente.id === id);
            if(!clienteEncontrado)
                return res.status(404).json({ erro: true, mensagem: "Cliente não encontrado" });

            clienteEncontrado.arquivado = !clienteEncontrado.arquivado;

            return res.status(200).json({ erro: false, mensagem: clienteEncontrado.arquivado ? "Cliente arquivado com sucesso" : "Cliente desarquivado com sucesso" });

        } catch (error) {
                console.error(error);
                return res.status(500).json({ mensagem: "Erro no servidor" });
        } 
    }

    async arquivarMedidor (req, res) {
        try {

            const { id } = req.params;

            const medidorEncontrado = await coordenadorModel.medidores.find(medidor => medidor.id === id);
            if(!medidorEncontrado)
                return res.status(404).json({ erro: true, mensagem: "Medidor não encontrado" });

            medidorEncontrado.arquivado = !medidorEncontrado.arquivado;

            return res.status(200).json({ erro: false, mensagem: medidorEncontrado.arquivado ? "Medidor arquivado com sucesso" : "Medidor desarquivado com sucesso" });

        
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        } 
    }
 
}

export default CoordenadorController;