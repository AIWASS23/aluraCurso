import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormEditarCliente from "../../Components/FormEditarCliente";
import useAdminProvider from "../../Hooks/useAdminProvider";
import PageDefault from "../../Utils/PageDefault";

const EditarCliente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profileRequest } = useAdminProvider();

    useEffect(() => {
        const fetchData = async () => {
            const response = await profileRequest();
            if(response.status === 401 || (response.funcoes.length === 1 && response.funcoes[0] === "Leiturista")) {
                navigate('/unauthorized');
            }
        }

        fetchData();
    }, []);

    return (
        <PageDefault title="Editar Cliente">
            <FormEditarCliente id_cliente={id} />
        </PageDefault>
    );
}

export default EditarCliente;