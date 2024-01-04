import { Autocomplete } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import ModalContainer from "../../../Components/Modal";
import useAdminProvider from "../../../Hooks/useAdminProvider";
import ErrorMessage from "../../../Utils/ErrorMessage";
import Modal from "../../../Utils/Modal";
import BotaoSelecionarCliente from '../../../Components/BotaoSelecionarCliente';

import './styles.css';
import DropdownSelecionarMedidorCliente from "../../../Components/DropdownSelecionarMedidorCliente";

const initialUserData = {
    imagem_leitura: '',
    id_medidor: '',
    valor: '',
}

const initialErrors = {
    imagem_leitura: false,
    imagem_leitura_message: '',
    id_medidor: false,
    id_medidor_message: '',
    valor: false,
    valor_message: '',
}

const CadastrarLeituraModal = ({ isOpen, onRequestClose, mostrarMensagemSucesso }) => {
    const { listarClientesDropdownRequest, openModal } = useAdminProvider();
    const [imageFilename, setImageFilename] = useState("");
    const [clienteSelecionado, setClienteSelecionado] = useState();
    const [medidorSelecionado, setMedidorSelecionado] = useState();
    const [medidoresCliente, setMedidoresCliente] = useState([]);

    const [userData, setUserData] = useState(initialUserData);
    const [error, setError] = useState(initialErrors);

    const handleSubmit = async () => {
        setError({
            imagem_leitura: !userData.imagem_leitura,
            imagem_leitura_message: "Selecione uma imagem",
            id_medidor: !userData.id_medidor,
            id_medidor_message: "Selecione um medidor",
            valor: !userData.valor,
            valor_message: "O valor é obrigatório",
        });

        if (userData.imagem_leitura && userData.id_medidor && userData.valor) {
            console.log(userData)
            // const response = await cadastrarMedidorRequest(userData);
            // if (response === "Novo medidor criado com sucesso") {
            //     mostrarMensagemSucesso();
            //     closeModal();
            // }
        }
    }

    function closeModal() {
        onRequestClose();
        setUserData(initialUserData);
        setError(initialErrors);
    }

    function handleUpdateImage(event) {
        setImageFilename(event.target.files[0].name)
    }

    return (
        <ModalContainer
            isOpen={isOpen}
            onRequestClose={closeModal}
            title="Cadastrar Leitura"
        >
            <div className="formRegisterGasMeter__container">
                <form action="" className='formUser__form' onSubmit={e => e.preventDefault()}>
                    <div className="formUser__row">
                        <div className="formUser__field">
                            <label className='formUser__label'>Imagem</label>
                            <input
                                id="image"
                                type="file"
                                name="avatar"
                                accept="image/png, image/jpeg"
                                onChange={handleUpdateImage}
                            />
                            <label className="inputImageLabel" htmlFor="image">
                                {imageFilename === "" ? "Escolha uma imagem" : imageFilename}
                            </label>
                            {error.imagem_leitura && <ErrorMessage message={error.imagem_leitura_message} />}
                        </div>
                    </div>
                    <div className="formUser__row">
                        <div className="formUser__field">
                            <label htmlFor="formUser__name" className='formUser__label'>Cliente</label>
                            <BotaoSelecionarCliente setClienteSelecionado={setClienteSelecionado} setMedidoresCliente={setMedidoresCliente} />
                            {error.id_medidor && <ErrorMessage message={error.id_medidor_message} />}
                        </div>
                        
                        { clienteSelecionado &&
                            <div className="formUser__field">
                                <label htmlFor="formUser__name" className='formUser__label'>Medidor</label>
                                <DropdownSelecionarMedidorCliente medidoresCliente={medidoresCliente} setMedidorSelecionado={setMedidorSelecionado} idCliente={clienteSelecionado.id} />
                                {error.id_medidor && <ErrorMessage message={error.id_medidor_message} />}
                            </div>
                        }
                    </div>
                    <div className="formUser__row">
                        <div className="formUser__field">
                            <label htmlFor="formUser__serial-number" className='formUser__label'>Valor</label>
                            <input id="formUser__serial-number"
                                type="number"
                                className='formUser__input'
                                placeholder="m³"
                                value={userData.numero_serie}
                                onChange={(e) => setUserData({ ...userData, valor: e.target.value })} />
                            {error.valor && <ErrorMessage message={error.valor_message} />}
                        </div>
                    </div>
                    <div className="formUser__buttons__field">
                        <button className='button --cancel' onClick={closeModal}>Cancelar</button>
                        <button className='button --confirm' onClick={() => handleSubmit()}>Salvar</button>
                    </div>
                </form>
                {openModal && <Modal title="Novo medidor criado com sucesso" link="/dashboard" />}
            </div>
        </ModalContainer>
    );
}

export default CadastrarLeituraModal;