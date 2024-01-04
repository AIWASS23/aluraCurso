import axios from "axios";

// const obterUsuarioRequest = async (id) => {
//     try {
//         const response = await axios.get(`/admin/user/${id}`);
//         const data = response.data.usuario;
//         return data;
//     } catch (error) {
//         console.error(error.response);
//         return error.response;
//     }
// }

// const listarUsuariosRequest = async () => {
//     try {
//         const response = await axios.get(`/admin/user`);
//         const data = response.data.usuarios;

//         if(data[0].email === "admin") {
//             data.splice(0, 1);
//         }

//         return data;
//     } catch (error) {
//         console.error(error.response);
//         return error.response;
//     }
// }

// const listarUsuariosArquivadosRequest = async () => {
//     try {
//         const response = await axios.get(`/admin/user?arquivado=true`);

//         const data = response.data.usuarios;

//         if (data[0].id === "1") {
//             data.splice(0, 1);
//         }

//         return data;
//     } catch (error) {
//         console.error(error.response);
//     }
// }

// const cadastrarUsuarioRequest = async (body) => {
//     try {
//         const response = await axios.post(`/admin/user`, body);
//         const data = response.data;
//         return data;
//     } catch (error) {
//         console.error(error.response);
//         return error.response.data.mensagem;
//     }
// }

// const editarUsuarioRequest = async (body, id) => {
//     try {
//         const response = await axios.patch(`/admin/user/${id}`, body);
//         const data = response.data;
//         toggleModalSuccess();
//         return data;
//     } catch (error) {
//         console.error(error.response);
//         return error.response.data.mensagem;
//     }
// }

const bloquearUsuarioRequest = async (id) => {
    try {
        const response = await axios.patch(`/admin/user/block/${id}`, null);
        const data = response.data;
    } catch (error) {
        console.error(error.response);
    }
}

const arquivarUsuarioRequest = async (id) => {
    try {
        const response = await axios.patch(`/admin/user/archive/${id}`, null);
        const data = response.data;
    } catch (error) {
        console.error(error.response);
    }
}

// const uploadImagemUsuarioRequest = async (imagem, email) => {
//     try {
//         const response = await axios.post(`/uploadImagem/usuario?email=${email}`, imagem);
//         const data = await response.data;
//     } catch (error) {
//         console.error(error.response)
//         return error.response;
//     }
// }

export default {
    //listarUsuariosArquivadosRequest,
    //listarUsuariosRequest,
    //obterUsuarioRequest,
    //cadastrarUsuarioRequest,
    //editarUsuarioRequest,
    arquivarUsuarioRequest,
    bloquearUsuarioRequest,
    //uploadImagemUsuarioRequest
}
