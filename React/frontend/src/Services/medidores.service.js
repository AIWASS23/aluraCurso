import axios from "axios";

const listarMedidoresRequest = async () => {
    try {

        const response = await axios.get(`/coordenador/medidor`);
        const data = await response.data.medidores;
        return data;
    } catch (error) {
        console.error(error.response);
        return error.response;
    }
}

const obterMedidorRequest = async (id) => {
    try {
        const response = await axios.get(`/coordenador/medidor/${id}`);
        const data = await response.data.medidor;
        setDetalhes(data);
    } catch (error) {
        console.error(error.response)
        return error.response;
    }
}

const cadastrarMedidorRequest = async (body) => {
    try {
        const response = await axios.post(`/coordenador/medidor`, body);
        const data = await response.data;
        return data.mensagem;
    } catch (error) {
        console.error(error.response)
        return error.response;
    }
}

const editarMedidorRequest = async (id, body) => {
    try {
        const response = await axios.patch(`/coordenador/medidor/${id}`, body);
        const data = await response.data;
        return data.mensagem;
    } catch (error) {
        console.error(error.response)
        return error.response;
    }
}

export default {
    listarMedidoresRequest,
    obterMedidorRequest,
    cadastrarMedidorRequest,
    editarMedidorRequest
}