import { useEffect, useState } from 'react';
import useAdminProvider from '../../Hooks/useAdminProvider';
import PageDefault from '../../Utils/PageDefault';
import { useNavigate } from 'react-router-dom';

import iconLockOpen from '../../Assets/icon-lock-open.svg';
import iconLockClose from '../../Assets/icon-lock-close.svg';
import iconArchiveRed from '../../Assets/icon-archive-red.svg';
import iconArchiveGreen from '../../Assets/icon-archive-green.svg';
import iconLupa from '../../Assets/icon-lupa.svg';
import iconAdd from '../../Assets/add.svg';

import UserPhoto from '../../Components/UserPhoto';

import ModalBlockUser from '../../Components/ModalBlockUser';

import Modal from '../../Utils/Modal';

import './styles.css';
import ManageUserModal from './CreateUserModal';

import usuariosService from '../../Services/usuarios.service';

const ListUsers = () => {
    const navigate = useNavigate();
    const { profileRequest } = useAdminProvider();

    const { loadUsersRequest, loadUsersArchivedRequest, openModal, setOpenModal, openModalBlock, setOpenModalBlock, userLogin, blockUserRequest, archiveUserRequest } = useAdminProvider();
    const [ listUsers, setListUsers ] = useState([]);
    const [ userSituation, setUserSituation ] = useState({
        id: '',
        situacao: ''
    });
    const [viewArchivedUsers, setViewArchivedUsers] = useState(false);
    const [ auxListUsers, setAuxListUsers ] = useState([]);

    const [mostrarCadastroUsuarioModal, setMostrarCadastroUsuarioModal] = useState(false);
    const [mostrarMensagemSucesso, setMostrarMensagemSucesso] = useState(false);

    const [mensagemModal, setMensagemModal] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await profileRequest();
            if(response.status === 401) {
                navigate('/unauthorized');
            }
        }

        fetchData();

        fetchUsers();
    }, [mostrarMensagemSucesso]);

    const bloquearUsuario = (id, situation) => {
        // usuariosService.bloquearUsuarioRequest(id);
        blockUserRequest(id);
        setUserSituation({
            id: id,
            situacao: situation
        });
        setOpenModalBlock(true);
    }
    const arquivarUsuario = (id) => {
        // usuariosService.arquivarUsuarioRequest(id);
        archiveUserRequest(id);
        setUserSituation({ id: id });
        setOpenModal(true);
    }

    const showProfile = (id) => {
        navigate(`/profile/${id}`);
    }

    async function fetchUsers() {
        const fetchData = await loadUsersRequest();
        setListUsers(fetchData);
        setAuxListUsers(fetchData);
    }
    async function fetchArchivedUsers() {
        const fetchData = await loadUsersArchivedRequest();
        setListUsers(fetchData);
    }

    function handleArchivedUsersButton() {
        setListUsers([]);

        setViewArchivedUsers(prevState => {
            if (prevState) {
                fetchUsers();
            } else {
                fetchArchivedUsers();
            }

            return !prevState;
        });
    }

    const handleChange = (event) => {
        const fetchData = auxListUsers.filter(user => user.nome.toLowerCase().includes(event.target.value.toLowerCase().trim()));
        setListUsers(fetchData);
    }

    return (
        <PageDefault title={`Usuários ${viewArchivedUsers ? "Arquivados" : ""}`}>
            <div className='userList__container'>
                <div className="userList__search">
                    <form onSubmit={e => e.preventDefault(e)}>
                        <input type="text" className='search-user__input' placeholder='Pesquisar por usuários' onChange={(event) => handleChange(event)} />
                        <img src={iconLupa} alt="Buscar" />
                    </form>
                </div>

                { !viewArchivedUsers ? 
                    <>
                        <div className="userList__archiveButton userList__top-button">
                            <button className='archiveButton' onClick={handleArchivedUsersButton}>
                                <span>Usuários arquivados</span>
                                <img src={iconArchiveRed} alt="Usuários arquivados" />
                            </button>
                        </div>
                    </>
                    :
                    <>
                        <div className="userList__unarchiveButton userList__top-button">
                            <button className='unarchiveButton' onClick={handleArchivedUsersButton}>
                                <span>Voltar</span>
                            </button>
                        </div>
                    </>
                }

                { userLogin.categoria.includes("Administrador") && listUsers && listUsers.length > 0 && 
                    <div className="userList__legend">
                        <div className="legend__block">
                            <span>Bloquear</span>
                        </div>
                        { !viewArchivedUsers ? 
                            <div className="legend__archive">
                                <span>Arquivar</span>
                            </div>   :
                            <div className="legend__unarchive">
                                <span>Desarquivar</span>
                            </div>   
                        }
                    </div>
                }

                <div className="userList__table">
                    { listUsers && listUsers.length > 0 && listUsers.map(item => 
                        <div className="userList__field" key={item.id}>
                            <div className="userList__profile">
                                <UserPhoto max_size="50" imagem_url={item.imagem_url} path="usuario/" />

                                <button className='userList__name' onClick={() => showProfile(item.id)}>
                                    {item.nome}
                                </button>
                            </div>
                            { userLogin.categoria.includes("Administrador") &&
                                <div className="userList__actions">
                                    <button className='action__block' onClick={() => bloquearUsuario(item.id, item.situacao)}>
                                        {   item.situacao === "Bloqueado" ?
                                            <img src={iconLockClose} alt="Desbloquear usuário" title='Desbloquear usuário' /> :
                                            <img src={iconLockOpen} alt="Bloquear usuário" title='Bloquear usuário' />
                                        }
                                    </button>
                                    <button className='action__archive' onClick={() => arquivarUsuario(item.id)}>
                                        { !viewArchivedUsers ? 
                                            <img
                                                src={iconArchiveRed}
                                                alt="Arquivar usuário"
                                                title='Arquivar usuário'
                                                onClick={() => setMensagemModal('Usuário arquivado com sucesso')}
                                            /> : 
                                            <img
                                                src={iconArchiveGreen}
                                                alt="Desarquivar usuário"
                                                title='Desarquivar usuário'
                                                onClick={() => setMensagemModal('Usuário desarquivado com sucesso')}
                                            /> 
                                        }
                                    </button>
                                </div>
                            }
                        </div>    
                    ) }
                </div>
                <div className='flex__justify-flex-end'>
                    <button type="button" className='botao__cadastrar' onClick={() => setMostrarCadastroUsuarioModal(true)}>
                        <img src={iconAdd} alt="Botão adicionar" />
                        Cadastrar usuário
                    </button>
                </div>
            </div>

            {/* MODAL */}
            { openModalBlock && <ModalBlockUser situation={userSituation.situacao} id={userSituation.id} /> }

            { openModal && <Modal link={`/profile/${userSituation.id}`} title={mensagemModal} /> }

            <ManageUserModal
                isOpen={mostrarCadastroUsuarioModal}
                onRequestClose={() => setMostrarCadastroUsuarioModal(false)}
                mostrarMensagemSucesso={() => setMostrarMensagemSucesso(true)}
            />
            { mostrarMensagemSucesso && (
                <Modal
                    title="Usuário cadastrado com sucesso"
                    fecharModalManualmente={() => setMostrarMensagemSucesso(false)}
                />
            ) }
        </PageDefault>
    );
}

export default ListUsers;