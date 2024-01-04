import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminProvider from '../../Hooks/useAdminProvider';
import PageDefault from '../../Utils/PageDefault';
import CadastrarClienteModal from './CadastrarClienteModal';
import Modal from '../../Utils/Modal';

import UserPhoto from '../../Components/UserPhoto';

import iconLupa from '../../Assets/icon-lupa.svg';
import iconAdd from '../../Assets/add.svg';
import iconArchiveRed from '../../Assets/icon-archive-red.svg';
import iconArchiveGreen from '../../Assets/icon-archive-green.svg'

import './styles.css';

const ListClients = () => {
    const navigate = useNavigate();
    const { profileRequest, userLogin } = useAdminProvider();
    const { listarClientesRequest, arquivarClienteRequest } = useAdminProvider();

    const [showCadastroClienteModal, setShowCadastroClienteModal] = useState(false);
    const [mostrarMensagemSucesso, setMostrarMensagemSucesso] = useState(false);
    const [viewArchivedClients, setViewArchivedClients] = useState(false);
    const [nomeCliente, setNomeCliente] = useState("");
    const [clienteArquivado, setClienteArquivado] = useState("");


    const [clientes, setClientes] = useState([]);
    const [Auxclientes, setAuxClientes] = useState([]);

    const exibirDetalhesCliente = (id_cliente) => {
        navigate(`/cliente/detalhes/${id_cliente}`);
    }

    useEffect(() => {
        async function fetch() {
            const response = await listarClientesRequest();
            setAuxClientes(response);
            const naoArquivados = response.filter(medidores => medidores.arquivado === false)
            setClientes(naoArquivados);
        }

        fetch();
    }, [mostrarMensagemSucesso]);

    const handleChange = (event, categoria) => {
        const fetchData = Auxclientes.filter(user => {
            return verificarArquivados(user.arquivado, categoria) && verificarCliente(user.nome,event,categoria);
        });
        setClientes(fetchData);
    }

    const verificarCliente = (clientValue, value, categoria) => {
        const nome_cliente = categoria === "nomeCliente" ? value : nomeCliente;
        return clientValue.toLowerCase().includes(nome_cliente.toLowerCase().trim());
    }

    const verificarArquivados = (clientValue, categoria) => {
        const arquivado = categoria === "arquivado" ? !viewArchivedClients : viewArchivedClients;
        return clientValue === arquivado;
    }

    const handleArquivar = async (id) => {
        const response = await arquivarClienteRequest(id);
        setClienteArquivado(id);
        setMostrarMensagemSucesso(!mostrarMensagemSucesso);
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await profileRequest();
            if(response.status === 401) {
                navigate('/unauthorized');
            }
        }

        fetchData();
    }, []);

    return (
        <PageDefault title={`Clientes ${viewArchivedClients? "arquivados":""}`}>
            <div className='userList__container'>
                <div className="userList__search">
                    <form onSubmit={e => e.preventDefault(e)}>
                    <input type="text" className='search-user__input' placeholder='Pesquisar por clientes' onChange={(event) => {
                        setNomeCliente(event.target.value)
                        handleChange(event.target.value, "nomeCliente")
                    }}/>
                        <img src={iconLupa} alt="Buscar" />
                    </form>
                </div>

                {!viewArchivedClients ?
                        <>
                            <div className="userList__archiveButton userList__top-button">
                                <button className='archiveButton' onClick={() => {
                                    setViewArchivedClients(!viewArchivedClients)
                                    handleChange(viewArchivedClients, "arquivado")
                                }}>
                                    <span>Clientes arquivados</span>
                                    <img src={iconArchiveRed} alt="Usuários arquivados" />
                                </button>
                            </div>
                        </>
                        :
                        <>
                            <div className="userList__unarchiveButton userList__top-button">
                                <button className='unarchiveButton' onClick={() => {
                                    setViewArchivedClients(!viewArchivedClients)
                                    handleChange(viewArchivedClients, "arquivado")
                                }}>
                                    <span>Voltar</span>
                                </button>
                            </div>
                        </>
                    }

                <div className="userList__table --tabela-clientes">
                    <div className="tableReadings__header">
                        <h2 className="tableClientes__header-item --cliente-nome"></h2>
                        <h2 className="tableClientes__header-item">CNPJ</h2>
                        <h2 className="tableClientes__header-item">LOGIX</h2>

                        { (userLogin.categoria.includes("Administrador") || userLogin.categoria.includes("Coordenador"))  
                            && clientes && clientes.length > 0 && (
                            <div className="userList__legend tableClientes__header-item">                                
                                { !viewArchivedClients ? 
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
                    </div>

                    {clientes.length > 0 && clientes.map(cliente => 
                        <div className="userList__field" key={cliente.id}>
                            <button className="tableClientes__item userList__profile --cliente-nome">
                                <UserPhoto max_size="50" imagem_url={cliente.imagem_url} path="cliente/" />

                                <button className='userList__name' onClick={() => exibirDetalhesCliente(cliente.id)}>
                                    {cliente.nome}
                                </button>
                            </button>

                            <p className='tableClientes__item'>{cliente.cnpj}</p>
                            <p className='tableClientes__item'>{cliente.logix}</p>
                            <button className='action__archive tableClientes__item'
                            // onClick={() => archiveUser(cliente.id)}
                            >
                                { (userLogin.categoria.includes("Administrador") || userLogin.categoria.includes("Coordenador"))  
                            && clientes && clientes.length > 0 && (
                            <div className="tableMedidores__item --center">                                
                                { !viewArchivedClients ? 
                                    <img
                                        src={iconArchiveRed}
                                        alt="Arquivar cliente"
                                        title='Arquivar cliente'
                                        onClick={() => handleArquivar(cliente.id)}
                                    /> : 
                                    <img
                                        src={iconArchiveGreen}
                                        alt="Desarquivar cliente"
                                        title='Desarquivar cliente'
                                        onClick={() => handleArquivar(cliente.id)}
                                    /> 
                                }
                                
                            </div>

                            )
                        }
                            </button>
                        </div>
                    )}   
                </div>

                <div className='flex__justify-flex-end'>
                    <button type="button" className='botao__cadastrar' onClick={() => setShowCadastroClienteModal(true)}>
                        <img src={iconAdd} alt="Botão adicionar" />
                        CADASTRAR CLIENTE
                    </button>
                </div>
            </div>

            {/* MODAL */}
            <CadastrarClienteModal
                isOpen={showCadastroClienteModal}
                onRequestClose={() => setShowCadastroClienteModal(false)}
                mostrarMensagemSucesso={() => setMostrarMensagemSucesso(true)}
            />
            { mostrarMensagemSucesso && (
                <Modal
                        title={`Cliente ${viewArchivedClients?"des":""}arquivado com sucesso`}
                        fecharModalManualmente={() => {
                        setMostrarMensagemSucesso(false)
                        exibirDetalhesCliente(clienteArquivado)
                    }}
                />
            ) }
        </PageDefault>
    );
}

export default ListClients;