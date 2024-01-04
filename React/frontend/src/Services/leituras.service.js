import axios from "axios";

const listarLeiturasRequest = async () => {
    try {
        const response = await axios.get(`/reader/reading`);
        const data = response.data.leituras;
        return data;
    } catch (error) {
        console.error(error.response);
    }
}

export default {
    listarLeiturasRequest
}