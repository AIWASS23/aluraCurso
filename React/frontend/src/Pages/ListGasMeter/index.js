import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminProvider from '../../Hooks/useAdminProvider';
import PageDefault from '../../Utils/PageDefault';

import iconAdd from '../../Assets/add.svg';
import iconArchiveRed from '../../Assets/icon-archive-red.svg';
import iconArchiveGreen from '../../Assets/icon-archive-green.svg'
import iconLupa from '../../Assets/icon-lupa.svg';

import './styles.css';
import CadastrarMedidorModal from './CadastrarMedidorModal';
import Modal from '../../Utils/Modal';

const ListGasMeter = () => {
    const navigate = useNavigate();
    const { profileRequest, arquivarMedidorRequest, userLogin } = useAdminProvider();

    const [medidores, setMedidores] = useState([]);
    const [auxMedidores, setAuxMedidores] = useState([]);
    const [nomeCliente, setNomeCliente] = useState("");

    const { listarMedidoresRequest } = useAdminProvider();

    const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
    const [mensagemModal, setMensagemModal] = useState('');
    const [mostrarMensagem, setMostrarMensagem] = useState(false);
    const [viewArchivedGasMeter, setViewArchivedGasMeter] = useState(false);

    const handleCloseModal = () => {
        setMostrarModalCadastro(false);
    };
    
    const handleShowModalMessage = (message) => {
        setMostrarModalCadastro(false);
        setMensagemModal(message);
        setMostrarMensagem(true);
    };

    useEffect(() => {
        const fetchDataUsuarioLogado = async () => {
            const response = await profileRequest();
            if (response.status === 401) {
                navigate('/unauthorized');
            }
        }

        async function fetchDataMedidores() {
            const response = await listarMedidoresRequest();
            setAuxMedidores(response);
            const naoArquivados = response.filter(medidores => medidores.arquivado === false)
            setMedidores(naoArquivados);
        }

        fetchDataUsuarioLogado();
        fetchDataMedidores();
    }, [mostrarMensagem]);

    const exibirDetalhesMedidor = (id_medidor) => {
        navigate(`/medidor/detalhes/${id_medidor}`);
    }

    const handleChange = (event, categoria) => {
        
        const fetchData = auxMedidores.filter(user => {
            return verificarArquivados(user.arquivado, categoria) && verificarMedidorCliente(user.nome_cliente,event,categoria);
        });
        setMedidores(fetchData);
    }

    const verificarMedidorCliente = (medidorValue, value, categoria) => {
        const nome_cliente = categoria === "nomeCliente" ? value : nomeCliente;
        return medidorValue.toLowerCase().includes(nome_cliente.toLowerCase().trim());
    }

    const verificarArquivados = (medidorValue, categoria) => {
        const arquivado = categoria === "arquivado" ? !viewArchivedGasMeter : viewArchivedGasMeter;
        return medidorValue === arquivado;
    }

    const handleArquivar = async (id) => {
        const response = await arquivarMedidorRequest(id);

        setMostrarMensagem(!mostrarMensagem);
        setMensagemModal(response.data.mensagem);        
    }

    return (
        <div>
            <PageDefault title={`Medidores ${viewArchivedGasMeter? "arquivados":""}`}>

                <div className='userList__container'>
                    <div className="userList__search">
                        <form onSubmit={e => e.preventDefault(e)}>
                            <input type="text" className='search-user__input' value={nomeCliente} placeholder='Pesquisar por medidores' onChange={(event) => {
                                setNomeCliente(event.target.value)
                                handleChange(event.target.value, "nomeCliente")
                            }} />
                            <img src={iconLupa} alt="Buscar" />
                        </form>
                    </div>

                    {!viewArchivedGasMeter ?
                        <>
                            <div className="userList__archiveButton userList__top-button">
                                <button className='archiveButton' onClick={() => {
                                    setViewArchivedGasMeter(!viewArchivedGasMeter)
                                    handleChange(viewArchivedGasMeter, "arquivado")
                                }}>
                                    <span>Medidores arquivados</span>
                                    <img src={iconArchiveRed} alt="Usuários arquivados" />
                                </button>
                            </div>
                        </>
                        :
                        <>
                            <div className="userList__unarchiveButton userList__top-button">
                                <button className='unarchiveButton' onClick={() => {
                                    setViewArchivedGasMeter(!viewArchivedGasMeter)
                                    handleChange(viewArchivedGasMeter, "arquivado")
                                }}>
                                    <span>Voltar</span>
                                </button>
                            </div>
                        </>
                    }

                    <div className="tableMedidores__header">
                        <ul className="tableMedidores__row">
                            <li className="tableMedidores__item --larger">Cliente</li>
                            <li className="tableMedidores__item --center">Número de série</li>
                            <li className="tableMedidores__item --center">Posição</li>
                            <li className="tableMedidores__item --center">Última leitura</li>
                            <li className="tableMedidores__item">PTZ</li>
                            { (userLogin.categoria.includes("Administrador") || userLogin.categoria.includes("Coordenador"))  
                            && medidores && medidores.length > 0 && (
                            <div className="userList__legend tableClientes__header-item">                                
                                { !viewArchivedGasMeter ? 
                                    <div className="legend__archive">
                                        <span>Arquivar</span>
                                    </div>   :
                                    <div className="legend__unarchive">
                                        <span>Desarquivar</span>
                                    </div>   
                                }
                                
                            </div>

                            )
                        }
                        </ul>
                    </div>
                    <div className="tableMedidores__body">
                        {medidores.length > 0 && medidores.map(medidor =>
                            <ul className="tableMedidores__row" key={medidor.id}>
                                <li className="tableMedidores__item --client-name --larger" onClick={() => exibirDetalhesMedidor(medidor.id)}>
                                    {medidor.nome_cliente} - {medidor.cnpj_cliente}
                                </li>
                                <li className="tableMedidores__item --center">{medidor.numero_serie}</li>
                                <li className="tableMedidores__item --center">{medidor.gps}</li>
                                <li className="tableMedidores__item --center">{medidor.ultima_leitura}</li>
                                <li className="tableMedidores__item">{medidor.ptz ? "Sim" : "Não"}</li>
                                <li className="tableMedidores__item --center">
                                            
                                        
                        { (userLogin.categoria.includes("Administrador") || userLogin.categoria.includes("Coordenador"))  
                            && medidores && medidores.length > 0 && (
                            <div className="tableMedidores__item --center">                                
                                { !viewArchivedGasMeter ? 
                                    <img
                                        src={iconArchiveRed}
                                        alt="Arquivar medidor"
                                        title='Arquivar medidor'
                                        className='--cursor-pointer'
                                        onClick={() => handleArquivar(medidor.id)}
                                    /> : 
                                    <img
                                        src={iconArchiveGreen}
                                        alt="Desarquivar medidor"
                                        title='Desarquivar medidor'
                                        className='--cursor-pointer'
                                        onClick={() => handleArquivar(medidor.id)}
                                    /> 
                                }
                                
                            </div>

                            )
                        }
                                </li>
                            </ul>
                        )}
                    </div>

                    <div className='flex__justify-flex-end'>
                        <button type="button" className='botao__cadastrar' onClick={() => setMostrarModalCadastro(true)}>
                            <img src={iconAdd} alt="Botão adicionar" />
                            CADASTRAR MEDIDOR
                        </button>
                    </div>
                </div>
            </PageDefault>

            {/* MODAL */}
            <CadastrarMedidorModal
                isOpen={mostrarModalCadastro}
                onRequestClose={handleCloseModal}
                handleShowModalMessage={handleShowModalMessage}
            />

            {mostrarMensagem && (
                <Modal
                    title={mensagemModal}
                    fecharModalManualmente={() => {
                        setMostrarMensagem(false)
                    }}
                />
            )}
        </div>
    );
}

export default ListGasMeter;