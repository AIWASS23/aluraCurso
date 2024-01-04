import axios from "axios";

const loginRequest = async (body) => {
    try {
        const response = await axios.post(`/admin/login`, body);
        const data = response.data;
        axios.defaults.headers.common['x-access-token'] = data.token;
        axios.defaults.headers.common['id-usuario']= data.id;
        return data;
    } catch (error) {
        console.error(error.response);
        return error.response.data.mensagem;
    }
}

const logoutRequest = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userLogin');
    localStorage.removeItem('detalhes');
    localStorage.removeItem('dashboard');
}

export default {
    loginRequest,
    logoutRequest
};