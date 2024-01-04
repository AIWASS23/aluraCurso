import { Autocomplete } from "@material-ui/core";
import { useEffect, useState } from "react";
import BotaoSelecionarCliente from "../../../Components/BotaoSelecionarCliente";
import ModalContainer from "../../../Components/Modal";
import useAdminProvider from "../../../Hooks/useAdminProvider";
import ErrorMessage from '../../../Utils/ErrorMessage';
import './styles.css';

const errosValoresIniciais = {
    id_cliente: false,
    id_cliente_message: '',
    numero_serie: false,
    numero_serie_message: '',
    gps: false,
    gps_message: '',
    ultima_leitura: false,
    ultima_leitura_message: '',
    qr_code: false,
    qr_code_message: '',
}

const EditarMedidorModal = ({ isOpen, onRequestClose, id_medidor, mostrarMensagemSucesso, mostrarMensagemSemAlteracao, detalhes }) => {
    const { listarClientesDropdownRequest, editarMedidorRequest } = useAdminProvider();
    const [valueCombobox, setValueCombobox] = useState();

    const [options, setOptions] = useState([]);
    const [userData, setUserData] = useState({});
    const [editBody, setEditBody] = useState();
    const [clienteSelecionado, setClienteSelecionado] = useState('');

    useEffect(() => {
        async function fetchData () {
            const response = await listarClientesDropdownRequest();
            setOptions(response);
        }

        setUserData({
            id_cliente: detalhes.id_cliente,
            numero_serie: detalhes.numero_serie,
            gps: detalhes.gps,
            ultima_leitura: detalhes.ultima_leitura,
            qr_code: detalhes.qr_code,
            arquivado: detalhes.arquivado,
            ptz: detalhes.ptz,
            percentual_variacao: detalhes.percentual_variacao * 100
        })

        setEditBody({ ...editBody, id_cliente: clienteSelecionado });
        fetchData();

    }, [detalhes, clienteSelecionado]);

    function closeModal() {
        onRequestClose();
        setEditBody();
        setError(errosValoresIniciais);
    }

    const [error, setError] = useState(errosValoresIniciais);

    const handleSubmit = async () => {
        setError({
            id_cliente: !userData.id_cliente,
            id_cliente_message: options.length === 0 ? "Não há clientes cadastrados no sistema" : "Por favor, selecione um cliente",
            numero_serie: !userData.numero_serie,
            numero_serie_message: "O campo número de série é obrigatório",
            gps: !userData.gps,
            gps_message: "O campo GPS é obrigatório",
            ultima_leitura: !userData.ultima_leitura,
            ultima_leitura_message: "O campo Leitura Inicial é obrigatório",
            qr_code: !userData.qr_code,
            qr_code_message: "O campo String QR-Code é obrigatório",
        });

        if(!editBody) {
            mostrarMensagemSemAlteracao();
            closeModal();
        }

        if(editBody.id_cliente || editBody.numero_serie || editBody.gps || editBody.ultima_leitura || editBody.qr_code || editBody.percentual_variacao || typeof(editBody.ptz) === 'boolean' || typeof(editBody.arquivado) === 'boolean') {
            const response = await editarMedidorRequest(id_medidor, editBody);
            validarResponse(response);
        }
    }

    const validarResponse = (response) => {
        if(response === "Medidor alterado com sucesso") {
            mostrarMensagemSucesso();
            closeModal();
        }
    }

    const toggleCheckboxPTZ = () => {
        if(userData.ptz) {
            setUserData({ ...userData, ptz: false }); 
            setEditBody({ ...editBody, ptz: false });
        } else {
            setUserData({ ...userData, ptz: true });
            setEditBody({ ...editBody, ptz: true });
        }
    }
    
    return (
        <ModalContainer isOpen={isOpen} onRequestClose={closeModal} title="Editar Medidor">
            <div className="formRegisterGasMeter__container">
                <form action="" className='formUser__form' onSubmit={e => e.preventDefault()}>
                    <div className="formUser__row">
                        <div className="formUser__field">
                            <label htmlFor="formUser__name" className='formUser__label'>Nome do Cliente</label>
                            <BotaoSelecionarCliente setClienteSelecionado={setClienteSelecionado} />
                            { error.id_cliente && <ErrorMessage message={error.id_cliente_message} /> }
                        </div>
                        <div className="formUser__field">
                            <label htmlFor="formUser__serial-number" className='formUser__label'>Número de Série</label>
                            <input id="formUser__serial-number" 
                                type="text" 
                                className='formUser__input'
                                placeholder="00000000000000" 
                                value={userData.numero_serie}
                                onChange={(e) => {setUserData({ ...userData, numero_serie: e.target.value }); setEditBody({ ...editBody, numero_serie: e.target.value })}} />
                            { error.numero_serie && <ErrorMessage message={error.numero_serie_message} /> }
                        </div>
                    </div>
                    <div className="formUser__row">
                        <div className="formUser__field">
                            <label htmlFor="formUser__gps" className='formUser__label'>GPS</label>
                            <input id="formUser__gps" 
                                type="text" 
                                className='formUser__input'
                                placeholder="00000000000000" 
                                value={userData.gps}
                                onChange={(e) => {setUserData({ ...userData, gps: e.target.value }); setEditBody({ ...editBody, gps: e.target.value })}} />
                            { error.gps && <ErrorMessage message={error.gps_message} /> }
                        </div>
                        <div className="formUser__field">
                            <label htmlFor="formUser__ultima_leitura" className='formUser__label'>Leitura Inicial</label>
                            <input id="formUser__ultima_leitura" 
                                type="text" 
                                className='formUser__input'
                                placeholder="00000000000000" 
                                value={userData.ultima_leitura}
                                onChange={(e) => {setUserData({ ...userData, ultima_leitura: e.target.value }); setEditBody({ ...editBody, ultima_leitura: e.target.value })}} />
                            { error.ultima_leitura && <ErrorMessage message={error.ultima_leitura_message} /> }
                        </div>
                    </div>
                    <div className="formUser__row">
                        <div className="formUser__field">
                            <label htmlFor="formUser__qr_code" className='formUser__label'>String QR-Code</label>
                            <input id="formUser__qr_code" 
                                type="text" 
                                className='formUser__input'
                                placeholder="000000000000" 
                                value={userData.qr_code}
                                onChange={(e) => {setUserData({ ...userData, qr_code: e.target.value }); setEditBody({ ...editBody, qr_code: e.target.value })}} />
                            { error.qr_code && <ErrorMessage message={error.qr_code_message} /> }
                        </div>
                        <div className="formUser__field">
                            <label htmlFor="formUser__percentual_variacao" className='formUser__label'>Percentual de Variação</label>
                            <div className="--inline">
                                <input id="formUser__percentual_variacao" 
                                    type="number" 
                                    className='formUser__input --percentual-variacao'
                                    value={userData.percentual_variacao}
                                    onChange={(e) => {setUserData({ ...userData, percentual_variacao: Math.max(0, Math.min(100, Number(e.target.value))) }); setEditBody({ ...editBody, percentual_variacao: Math.max(0, Math.min(100, Number(e.target.value))) })}} />
                                <span>%</span>
                            </div>
                        </div>
                    </div>
                    <div className="formUser__field --checkbox">
                        <label htmlFor="formUser__checkbox">Medidor possui PTZ?</label>
                        <input type="checkbox" name="formUser__checkbox" id="formUser__checkbox" checked={userData.ptz} onChange={() => toggleCheckboxPTZ()} />
                    </div>
                    <div className="formUser__buttons__field">
                        <button className='button --cancel' onClick={closeModal}>Cancelar</button>
                        <button className='button --confirm' onClick={() => handleSubmit()}>Salvar</button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
}

export default EditarMedidorModal;