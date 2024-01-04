import axios from "axios";

// const listarClientesRequest = async () => {
//     try {
//         const response = await axios.get(`/coordenador/cliente?incluir_arquivados=true`);
//         const data = await response.data.clientes;
//         return data;
//     } catch (error) {
//         console.error(error.response.data);
//         return error.response.data;
//     }
// }

const listarClientesDropdownRequest = async () => {
    try {
        const response = await axios.get(`/coordenador/clientes`);
        const data = await response.data.clientes;
        return data;
    } catch (error) {
        console.error(error.response.data);
        return error.response.data;
    }
}

// const cadastrarClienteRequest = async (body) => {
//     try {
//         const response = await axios.post(`/coordenador/cliente`, body);
//         return response.status;
//     } catch (error) {
//         console.error(error.response.data);
//         return error.response.data;
//     }
// }

// const editarClienteRequest = async (id, body) => {
//     try {
//         const response = await axios.patch(`/coordenador/cliente/${id}`, body);
//         const data = await response.data;
//         return data.mensagem;
//     } catch (error) {
//         console.error(error.response)
//         return error.response;
//     }
// }

// const uploadImagemClienteRequest = async (imagem, logix) => {
//     try {
//         const response = await axios.post(`/uploadImagem/cliente?logix=${logix}`, imagem);
//         const data = await response.data;
//     } catch (error) {
//         console.error(error.response)
//         return error.response;
//     }
// }

export default {
    // listarClientesRequest,
    listarClientesDropdownRequest,
    // cadastrarClienteRequest,
    // editarClienteRequest,
    // uploadImagemClienteRequest
}