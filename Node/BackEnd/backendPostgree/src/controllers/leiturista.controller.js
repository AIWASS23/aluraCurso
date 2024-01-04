import { format } from "date-fns";
import crypto from "crypto";

import Controller from "./controller.js";

import conexao from "../models/conexao.js";
import coordenadorModel from "../models/coordenador.model.js";
import leituristaModel from "../models/leiturista.model.js";
import loginModel from "../models/login.model.js";

import calcularMedia from "../utils/calcularMedia.util.js";

class LeituristaController extends Controller {
    async sincronizar (req, res) {
        try {
            // TODO: Sincronizar dados
            return res.status(200).json({ mensagem: "Sincronização concluída" });

        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async listarLeiturasTodas (req, res) {
        try {
            const leituras = await leituristaModel;
    
            return res.status(200).json({ leituras: leituras.todas, possiveis_erros: leituras.possiveis_erros });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async listarLeiturasHoje (req, res) {
        try {
            const leituras = await leituristaModel;
            const hoje = format(new Date(), "dd/MM/yyyy");
    
            const leiturasHoje = leituras.todas.filter(leitura => leitura.data === hoje);
    
            return res.status(200).json({ leituras: leiturasHoje });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async obterLeitura (req, res) {
        try {
            const { id } = req.params;
            const leituraEncontrada = await leituristaModel.todas.find(leitura => leitura.id === id);
            if(!leituraEncontrada)
                return res.status(404).json({ erro: true, mensagem: "Leitura não encontrada" });

            return res.status(200).json({ erro: false, leitura: leituraEncontrada });
            
        } catch (error) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async verificarLeitura (req, res) {
        try {
            const { valor, id_medidor } = req.body;    

            if(valor%1 !== 0 || typeof(valor) !== 'number' || valor < 0){
                return res.status(400).json({
                    mensagem: "O valor inserido é invalido, coloque apenas números inteiros positivos"
                });
            }

            if(valor > 9999999) {
                return res.status(400).json({ mensagem: "O valor da medição contém, no máximo, 7 caracteres inteiros" });
            }

            const medidorEncontrado = await coordenadorModel.medidores.find(medidor => medidor.id === id_medidor);
            if(!medidorEncontrado) {
                return res.status(404).json({ mensagem: "Medidor não encontrado. Entre em contato com seu coordenador" });
            }

            const leituras = await leituristaModel;
            
            const leiturasMedidor = leituras.todas.filter(leitura => leitura.id_medidor === id_medidor);
            const ultimaLeitura = leiturasMedidor[leiturasMedidor.length - 1];            
            const leituraMenor = ultimaLeitura && valor < ultimaLeitura.valor;

            if(leituraMenor) {
                return res.status(200).json({
                    mensagem: "A leitura atual é menor que a anterior. Isso está correto?",
                    confirmacao: {
                        type: "POST",
                        rel: "registrar_leitura",
                        uri: "api.iticdigital.com.br/reader/reading",
                    },
                });
            }

            const ultimas12Leituras = leiturasMedidor.reverse().slice(0, 12);
            const listaAuxUltimas12Leituras = [];
            
            for(let reading of ultimas12Leituras) {
                listaAuxUltimas12Leituras.push(reading.valor);
            }
            
            const media = calcularMedia(listaAuxUltimas12Leituras);
            const percentualVariacao = media * medidorEncontrado.percentual_variacao;
            const desvioPadraoValido = (valor <= Math.round(media  + percentualVariacao)) && (valor >= Math.round(media - percentualVariacao));

            if(ultimaLeitura && !desvioPadraoValido) {
                return res.status(200).json({
                    mensagem: "A leitura atual parece ser um erro de digitação. Isso está correto?",
                    confirmacao: {
                        type: "POST",
                        rel: "registrar_leitura",
                        uri: "api.iticdigital.com.br/reader/reading",
                    }
                });
            }
    
            // return res.status(204).json();
            return  res.status(200).json({
                leituras,
                ultimaLeitura,
                media,
                percentual_variacao_medidor: medidorEncontrado.percentual_variacao,
                percentualVariacao,
                desvioPadraoValido
            })

        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async cadastrarLeitura (req, res) {
        try {
            const { id_medidor, leitura_imagem, valor, logix } = req.body;

            const usuarioLogado = await loginModel[0];
            if(!usuarioLogado) {
                return res.status(401).json({ mensagem: "Você não está logado no sistema" });
            }
            
            if(valor%1 !== 0 || valor < 0){
                return res.status(400).json({
                    mensagem:"O valor inserido é invalido, coloque apenas números inteiros positivos"
                });
            }
            
            if(valor > 9999999) {
                return res.status(400).json({ mensagem: "O valor da medição contém, no máximo, 7 caracteres inteiros" });
            }
            
            const medidorEncontrado = await coordenadorModel.medidores.find(medidor => medidor.id === id_medidor);
            if(!medidorEncontrado) {
                return res.status(404).json({ mensagem: "Medidor não encontrado. Entre em contato com seu coordenador" });
            }

            const clienteEncontrado = await coordenadorModel.clientes.find(cliente => cliente.id === medidorEncontrado.id_cliente);
            if(!clienteEncontrado) {
                return res.status(404).json({ mensagem: "Cliente não encontrado. Entre em contato com seu coordenador" });
            }

            // const logix = clienteEncontrado.logix;

            const nomeCliente = clienteEncontrado.nome;
            const nomeLeiturista = usuarioLogado.nome;
            
            const leituras = await leituristaModel;
            const id = crypto.randomUUID();
            const date_time = new Date();
            const data = format(new Date(), "dd/MM/yyyy");
            const horario = format(new Date(), "hh:mm:ss");
            
            const leiturasMedidor = leituras.todas.filter(leitura => leitura.id_medidor === id_medidor);
            const ultimaLeitura = leiturasMedidor[leiturasMedidor.length - 1];
            const leituraMenor = ultimaLeitura && valor < ultimaLeitura.valor;

            const ultimas12Leituras = leiturasMedidor.reverse().slice(0, 12);
            const listaAuxUltimas12Leituras = [];
            
            for(let reading of ultimas12Leituras) {
                listaAuxUltimas12Leituras.push(reading.valor);
            }
            
            const media = calcularMedia(listaAuxUltimas12Leituras);
            const percentualVariacao = media * medidorEncontrado.percentual_variacao;
            const desvioPadraoValido = (valor <= Math.round(media  + percentualVariacao)) && (valor >= Math.round(media - percentualVariacao));
            const possivel_erro = ultimaLeitura && (!desvioPadraoValido || leituraMenor) ? true : false;

            const statusLeitura = possivel_erro ? "Suspeita de erro" : "Sincronizada";

            const novaLeitura = {
                id,
                id_medidor,  
                nome_cliente: nomeCliente,
                nome_leiturista: nomeLeiturista,
                leitura_imagem: leitura_imagem && id_medidor + "_" + leitura_imagem,
                date_time,
                data,
                horario,
                valor,
                logix,
                possivel_erro,
                status: statusLeitura,
                arquivado: false,
            }

            medidorEncontrado.ultima_leitura = valor;
            leituras.todas.push(novaLeitura);
            possivel_erro && leituras.possiveis_erros.push(novaLeitura);

            // const novaLeitura = await conexao('leituras').insert({
            //     id: id,
            //     id_cliente: client_id,
            //     valor: valor,
            //     data_leitura: date,
            //     hora_leitura: time,
            //     possivel_erro: possivel_erro
            // });
    
            return res.status(201).json({
                mensagem: "Leitura registrada com sucesso",
                nova_leitura: novaLeitura
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async editarLeitura (req, res) {
        try {
            const { id } = req.params;
            const { valor, leitura_imagem } = req.body;
    
            const leituraEncontrada = await leituristaModel.todas.find(leitura => leitura.id === id);
            if(!leituraEncontrada) {
                return res.status(404).json({ mensagem: "Leitura não encontrada" });
            }
    
            const usuarioLogado = await loginModel[0];
            if(usuarioLogado.id !== leituraEncontrada.id_leiturista && !usuarioLogado.categoria.includes("Administrador")) {
                return res.status(401).json({ mensagem: "Você não tem autorização para modificar registros de outros leituristas" });
            }

            const medidorEncontrado = await coordenadorModel.medidores.find(medidor => medidor.id === leituraEncontrada.id_medidor);
    
            const hoje = format(new Date(), "dd/MM/yyyy");
            if(leituraEncontrada.data !== hoje) {
                return res.status(401).json({ mensagem: "Você não tem autorização para modificar registros antigos" });
            }
    
            if(valor) {
                leituraEncontrada.valor = valor;
                medidorEncontrado.ultima_leitura = valor;
            }
    
            if(leitura_imagem) {
                if (leituraEncontrada.leitura_imagem) {
                    const directoryPath = path.join('src/public/images/leituras/');
                    const imagemPath = `${directoryPath}${leituraEncontrada.leitura_imagem}`;
                    fs.unlink(imagemPath, err => {
                        if(err) {
                            console.error(err);
                            return res.status(400).json({ mensagem: "Erro ao excluir imagem no servidor" });
                        }
                    });
                }
                
                leituraEncontrada.leitura_imagem = `${leituraEncontrada.id_medidor}_${leitura_imagem}`;
            }

            const date_time = new Date();
            leituraEncontrada.date_time = date_time;
    
            return res.status(200).json({ mensagem: "Leitura modificada com sucesso" });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

    async arquivarLeitura (req, res) {
        try {

            const { id } = req.params;

            const leituraEncontrada = await leituristaModel.todas.find(leitura => leitura.id === id);
            if(!leituraEncontrada)
                return res.status(404).json({ erro: true, mensagem: "Leitura não encontrada" });

            leituraEncontrada.arquivado = !leituraEncontrada.arquivado;
            return res.status(200).json({
                erro: false,
                mensagem: leituraEncontrada.arquivado ? "Leitura arquivada com sucesso" : "Leitura desarquivada com sucesso"
            })
            
        } catch (error) {
            console.erro(erro);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }
    }

}

export default LeituristaController;