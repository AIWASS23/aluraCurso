import { useState } from "react";
import { useEffect } from "react";
import BotaoSelecionarCliente from "../../../Components/BotaoSelecionarCliente";
import ModalContainer from "../../../Components/Modal";
import useAdminProvider from "../../../Hooks/useAdminProvider";
import ErrorMessage from "../../../Utils/ErrorMessage";
import Modal from "../../../Utils/Modal";
import './styles.css';

import './styles.css';

const initialUserData = {
    id_cliente: '',
    numero_serie: '',
    gps: '',
    ultima_leitura: '',
    qr_code: '',
    percentual_variacao: '',
    ptz: false,
}

const initialErrors = {
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

const CadastrarMedidorModal = ({ isOpen, onRequestClose, handleShowModalMessage }) => {
    const { listarClientesDropdownRequest, cadastrarMedidorRequest, openModal } = useAdminProvider();
    const [clienteSelecionado, setClienteSelecionado] = useState('');
    const [options, setOptions] = useState();
    const [userData, setUserData] = useState(initialUserData);
    const [error, setError] = useState(initialErrors);

    useEffect(() => {
        async function fetchData () {
            const response = await listarClientesDropdownRequest();
            setOptions(response);
        }

        fetchData();
        setUserData({ ...userData, id_cliente: clienteSelecionado })
    }, [clienteSelecionado]);


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

        if(userData.id_cliente && userData.numero_serie && userData.gps && userData.ultima_leitura && userData.qr_code) {
            const response = await cadastrarMedidorRequest(userData);
            
            if (response.status === 201) {
                setUserData(initialUserData);
                setError(initialErrors);
            }

            handleShowModalMessage(response.data.mensagem);
        }
    }

    const toggleCheckboxPTZ = () => {
        userData.ptz ? setUserData({ ...userData, ptz: false }) : setUserData({ ...userData, ptz: true });
    }

    return (
        <ModalContainer
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title="Cadastrar Medidor"
        >
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
                                onChange={(e) => setUserData({ ...userData, numero_serie: e.target.value })} />
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
                                onChange={(e) => setUserData({ ...userData, gps: e.target.value })} />
                            { error.gps && <ErrorMessage message={error.gps_message} /> }
                        </div>
                        <div className="formUser__field">
                            <label htmlFor="formUser__ultima_leitura" className='formUser__label'>Leitura Inicial</label>
                            <input id="formUser__ultima_leitura" 
                                type="text" 
                                className='formUser__input'
                                placeholder="00000000000000" 
                                value={userData.ultima_leitura}
                                onChange={(e) => setUserData({ ...userData, ultima_leitura: e.target.value })} />
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
                                onChange={(e) => setUserData({ ...userData, qr_code: e.target.value })} />
                            { error.qr_code && <ErrorMessage message={error.qr_code_message} /> }
                        </div>
                        <div className="formUser__field">
                            <label htmlFor="formUser__percentual_variacao" className='formUser__label'>Percentual de Variação</label>
                            <div className="--inline">
                                <input id="formUser__percentual_variacao" 
                                    type="number" 
                                    className='formUser__input --percentual-variacao'
                                    placeholder="18"
                                    value={userData.percentual_variacao}
                                    onChange={(e) => setUserData({ ...userData, percentual_variacao: Math.max(0, Math.min(100, Number(e.target.value))) })} />
                                <span>%</span>
                            </div>
                        </div>
                    </div>
                    <div className="formUser__field --checkbox">
                        <label htmlFor="formUser__checkbox">Medidor possui PTZ?</label>
                        <input type="checkbox" name="formUser__checkbox" id="formUser__checkbox" checked={userData.ptz} onChange={() => toggleCheckboxPTZ()} />
                    </div>
                    <div className="formUser__buttons__field">
                        <button className='button --cancel' onClick={onRequestClose}>Cancelar</button>
                        <button className='button --confirm' onClick={() => handleSubmit()}>Salvar</button>
                    </div>
                </form>
                { openModal && <Modal title="Novo medidor criado com sucesso" link="/dashboard" /> }
            </div>
        </ModalContainer>
    );
}

export default CadastrarMedidorModal;