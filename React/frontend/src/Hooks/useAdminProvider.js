import axios from "axios";
import { useState } from "react";
import { useLocalStorage } from "react-use";

axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.defaults.baseURL = 'http://api.iticdigital.com.br';
// axios.defaults.baseURL = 'http://localhost:8080';

const useAdminProvider = () => {
    const [token, setToken] = useLocalStorage('token', { key: '' });
    const [userLogin, setUserLogin] = useLocalStorage('userLogin', {});
    const [detalhes, setDetalhes] = useLocalStorage('detalhes', {});
    const [dashboard, setDashboard] = useLocalStorage('dashboard', {});

    const [openModal, setOpenModal] = useState(false);
    const [openModalBlock, setOpenModalBlock] = useState(false);

    const url_server_imagem = `${axios.defaults.baseURL}/file/`;

    const toggleModalSuccess = () => {
        setOpenModal(true);
    }

    const converterCategoria = (array) => {
        return array.join(', ');
    }

    const loginRequest = async (body) => {
        try {
            const response = await axios.post(`/admin/login`, body);
            const data = response.data;
            setToken({ key: data.token, id_usuario: data.id });
            setUserLogin(data);
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

    const getUserRequest = async (id) => {
        try {
            const response = await axios.get(`/admin/user/${id}`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = response.data.usuario;
            setDetalhes(data);
        } catch (error) {
            console.error(error.response);
        }
    }

    const loadUsersRequest = async () => {
        try {
            const response = await axios.get(`/admin/user`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = response.data.usuarios;

            if (data[0].email === "admin") {
                data.splice(0, 1);
            }

            return data;
        } catch (error) {
            console.error(error.response);
            return error.response;
        }
    }

    const loadUsersArchivedRequest = async () => {
        try {
            const response = await axios.get(`/admin/user?arquivado=true`, {
                headers: {
                    'x-access-token': token.key
                }
            });

            const data = response.data.usuarios;

            if (data[0].id === "1") {
                data.splice(0, 1);
            }

            return data;
        } catch (error) {
            console.error(error.response);
        }
    }

    const registerUserRequest = async (body) => {
        try {
            const response = await axios.post(`/admin/user`, body, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = response.data;
            toggleModalSuccess();
        } catch (error) {
            console.error(error.response);
            return error.response.data.mensagem;
        }
    }

    const editUserRequest = async (body, id) => {
        try {
            const response = await axios.patch(`/admin/user/${id}`, body, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = response.data;
            toggleModalSuccess();
            return data;
        } catch (error) {
            console.error(error.response);
            return error.response.data.mensagem;
        }
    }

    const blockUserRequest = async (id) => {
        try {
            if (userLogin.categoria.includes("Administrador")) {
                const response = await axios.patch(`/admin/user/block/${id}`, null, {
                    headers: {
                        'x-access-token': token.key
                    }
                });
                const data = response.data;
                loadUsersRequest();
                loadUsersArchivedRequest();
            }
        } catch (error) {
            console.error(error.response);
        }
    }

    const archiveUserRequest = async (id) => {
        try {
            if (userLogin.categoria.includes("Administrador")) {
                const response = await axios.patch(`/admin/user/archive/${id}`, null, {
                    headers: {
                        'x-access-token': token.key
                    }
                });
                const data = response.data;
                loadUsersRequest();
                loadUsersArchivedRequest();
            }
        } catch (error) {
            console.error(error.response);
        }
    }

    const recoverPasswordRequest = async (body) => {
        try {
            const response = await axios.post(`/recoverPassword`, body, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = response.data;
            return data.mensagem;
        } catch (error) {
            console.error(error.response);
            return error.response.data.mensagem;
        }
    }

    const verifyUserRequest = async (body, id) => {
        try {
            const response = await axios.put(`/verify/${id}`, body, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = response.data;
            return data.mensagem;
        } catch (error) {
            console.error(error.response);
            return error.response.data;
        }
    }

    const loadDashboardRequest = async () => {
        try {
            const response = await axios.get(`/dashboard`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = response.data;
            setDashboard(data);
            return data;
        } catch (error) {
            console.error(error.response);
            return error.response;
        }
    }

    const loadReadingsRequest = async () => {
        try {
            const response = await axios.get(`/reader/reading`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = response.data.leituras;
            return data;
        } catch (error) {
            console.error(error.response);
        }
    }

    const profileRequest = async () => {
        try {
            const response = await axios.get(`/profile`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = response.data.usuario;
            return data;
        } catch (error) {
            console.error(error.response);
            return error.response;
        }
    }

    const listarMedidoresRequest = async () => {
        try {

            const response = await axios.get(`/coordenador/medidor`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data.medidores;
            return data;
        } catch (error) {
            console.error(error.response);
            return error.response;
        }
    }

    const listarClientesRequest = async () => {
        try {
            const response = await axios.get(`/coordenador/cliente?incluir_arquivados=true`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data.clientes;
            return data;
        } catch (error) {
            console.error(error.response.data);
            return error.response.data;
        }
    }

    const listarClientesDropdownRequest = async () => {
        try {
            const response = await axios.get(`/coordenador/clientes`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data.clientes;
            return data;
        } catch (error) {
            console.error(error.response.data);
            return error.response.data;
        }
    }

    const cadastrarClienteRequest = async (body) => {
        try {
            const response = await axios.post(`/coordenador/cliente`, body, {
                headers: {
                    'x-access-token': token.key
                }
            });
            return response.status;
        } catch (error) {
            console.error(error.response.data);
            return error.response.data;
        }
    }

    const cadastrarMedidorRequest = async (body) => {
        try {
            const response = await axios.post(`/coordenador/medidor`, body, {
                headers: {
                    'x-access-token': token.key
                }
            });
            return response;
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    const uploadImagemUsuarioRequest = async (imagem, email) => {
        try {
            const response = await axios.post(`/uploadImagem/usuario?email=${email}`, imagem, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data;
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    const uploadImagemClienteRequest = async (imagem, logix) => {
        try {
            const response = await axios.post(`/uploadImagem/cliente?logix=${logix}`, imagem, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data;
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    const exibirDetalhesMedidorRequest = async (id) => {
        try {
            const response = await axios.get(`/coordenador/medidor/${id}`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data.medidor;
            setDetalhes(data);
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    const exibirDetalhesClienteRequest = async (id) => {
        try {
            const response = await axios.get(`/coordenador/cliente/${id}`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data.cliente;
            setDetalhes(data);
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    const editarMedidorRequest = async (id, body) => {
        try {
            const response = await axios.patch(`/coordenador/medidor/${id}`, body, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data;
            return data.mensagem;
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    const editarClienteRequest = async (id, body) => {
        try {
            const response = await axios.patch(`/coordenador/cliente/${id}`, body, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data;
            return data.mensagem;
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    const exibirExtratoLeiturasRequest = async () => {
        try {
            const response = await axios.get(`/extrato`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data.extrato;
            return data;
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    const arquivarClienteRequest = async(id) => {
        try {
            const response = await axios.patch(`/coordenador/cliente/arquivar/${id}`, null, {
                headers: {
                    'x-access-token': token.key
                }
            });

            const data = await response.data.mensagem;
            return data;

        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }
    const arquivarMedidorRequest = async (id) => {
        try {
            const response = await axios.patch(`/coordenador/medidor/arquivar/${id}`, null,{
                headers: {
                    'x-access-token': token.key,
                    'id-usuario': token.id_usuario,
                }
            });
            return response;
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    const arquivarLeituraRequest = async (id) => {
        try {
            const response = await axios.patch(`/reader/leitura/arquivar/${id}`, null, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data.mensagem;
            return data;
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    const obterLeituraRequest = async (id) => {
        try {
            const response = await axios.get(`/reader/leitura/${id}`, {
                headers: {
                    'x-access-token': token.key
                }
            });
            const data = await response.data.leitura;
            setDetalhes(data);
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    const listarMedidoresClienteRequest = async (id) => {
        try {
            const response = await axios.get(`/coordenador/medidores/cliente/${id}`, {
                headers: {
                    'x-access-token': token.key
                }
            });
        } catch (error) {
            console.error(error.response)
            return error.response;
        }
    }

    return {
        token,
        openModal,
        setOpenModal,
        openModalBlock,
        setOpenModalBlock,
        userLogin,
        detalhes,
        dashboard,
        url_server_imagem,

        converterCategoria,

        loginRequest,
        logoutRequest,
        getUserRequest,
        loadUsersRequest,
        loadUsersArchivedRequest,
        registerUserRequest,
        editUserRequest,
        blockUserRequest,
        archiveUserRequest,
        recoverPasswordRequest,
        verifyUserRequest,
        loadDashboardRequest,
        loadReadingsRequest,
        profileRequest,
        listarMedidoresRequest,
        listarClientesRequest,
        listarClientesDropdownRequest,
        cadastrarClienteRequest,
        cadastrarMedidorRequest,
        uploadImagemUsuarioRequest,
        uploadImagemClienteRequest,
        exibirDetalhesMedidorRequest,
        editarMedidorRequest,
        exibirDetalhesClienteRequest,
        editarClienteRequest,
        exibirExtratoLeiturasRequest,
        arquivarClienteRequest,
        arquivarLeituraRequest,
        obterLeituraRequest,
        arquivarMedidorRequest,
        listarMedidoresClienteRequest,
    }
}

export default useAdminProvider;