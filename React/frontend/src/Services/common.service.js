import axios from "axios";

const recuperarSenhaRequest = async (body) => {
    try {
        const response = await axios.post(`/recoverPassword`, body);
        const data = response.data;
        return data.mensagem;
    } catch (error) {
        console.error(error.response);
        return error.response.data.mensagem;
    }
}

const verificarUsuarioRequest = async (body, id) => {
    try {
        const response = await axios.put(`/verify/${id}`, body);
        const data = response.data;
        return data.mensagem;
    } catch (error) {
        console.error(error.response);
        return error.response.data;
    }
}

const exibirDashboardRequest = async () => {
    try {
        const response = await axios.get(`/dashboard`);
        const data = response.data;
        setDashboard(data);
        return data;
    } catch (error) {
        console.error(error.response);
        return error.response;
    }
}

const perfilRequest = async () => {
    try {
        const response = await axios.get(`/profile`);
        const data = response.data.usuario;
        return data;
    } catch (error) {
        console.error(error.response);
        return error.response;
    }
}

const exibirExtratoLeiturasRequest = async () => {
    try {
        const response = await axios.get(`/extrato`);
        const data = await response.data.extrato;
        return data;
    } catch (error) {
        console.error(error.response)
        return error.response;
    }
}

export default {
    recuperarSenhaRequest,
    verificarUsuarioRequest,
    perfilRequest,
    exibirDashboardRequest,
    exibirExtratoLeiturasRequest
}