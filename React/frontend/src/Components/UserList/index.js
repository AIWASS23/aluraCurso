import './styles.css';
import iconLockOpen from '../../Assets/icon-lock-open.svg';
import iconLockClose from '../../Assets/icon-lock-close.svg';
import iconArchiveRed from '../../Assets/icon-archive-red.svg';
import iconArchiveGreen from '../../Assets/icon-archive-green.svg';
import useAdminProvider from '../../Hooks/useAdminProvider';
import Modal from '../../Utils/Modal';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModalBlockUser from '../ModalBlockUser';
import UserPhoto from '../UserPhoto';
import iconLupa from '../../Assets/icon-lupa.svg';

function UserList(props) {
    const { 
            blockUserRequest, 
            archiveUserRequest, 
            loadUsersRequest, 
            loadUsersArchivedRequest, 
            openModal, 
            setOpenModal, 
            openModalBlock, 
            setOpenModalBlock, 
            userLogin } = useAdminProvider();

    const [ listUsers, setListUsers ] = useState([]);
    const [ auxListUsers, setAuxListUsers ] = useState([]);
    const [ userSituation, setUserSituation ] = useState({
        id: '',
        situacao: ''
    });
    const navigate = useNavigate();


    const blockUser = (id, situation) => {
        blockUserRequest(id);
        setUserSituation({
            id: id,
            situacao: situation
        });
        setOpenModalBlock(true);
    }
    const archiveUser = (id) => {
        archiveUserRequest(id);
        setUserSituation({ id: id });
        setOpenModal(true);
    }

    const showProfile = (id) => {
        navigate(`/profile/${id}`);
    }

    useEffect(() => {
        async function fetch() {
            const fetchData = await loadUsersRequest();
            setListUsers(fetchData);
            setAuxListUsers(fetchData);
           }

        async function fetchArchived() {
            const fetchData = await loadUsersArchivedRequest();
            setListUsers(fetchData);
        }

        !props.archived ? fetch() : fetchArchived();
    }, []);

    const handleChange = async (event) => {
            const fetchData = auxListUsers.filter(user => user.nome.toLowerCase().includes(event.target.value.toLowerCase().trim()));
            setListUsers(fetchData);
    }

    return (
        <div className='userList__container'>
            <div className="userList__search">
                <form onSubmit={e => e.preventDefault(e)}>
                <input type="text" className='search-user__input' placeholder='Pesquisar por usuários' onChange={(event) => handleChange(event)} />
                    <img src={iconLupa} alt="Buscar" />
                </form>
            </div>

            { userLogin.funcoes.includes("Administrador") && listUsers && listUsers.length > 0 && 
                <div className="userList__legend">
                    <div className="legend__block">
                        <span>Bloquear</span>
                    </div>
                    { !props.archived ? 
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
                        <button className="userList__profile">

                            <UserPhoto max_size="50" imagem_url={item.imagem_url} path="usuario/" />

                            <button className='userList__name' onClick={() => showProfile(item.id)}>
                                {item.nome}
                            </button>
                        </button>
                        { userLogin.funcoes.includes("Administrador") && 
                            <div className="userList__actions">
                                <button className='action__block' onClick={() => blockUser(item.id, item.situacao)}>
                                    {   item.situacao === "Bloqueado" ?
                                        <img src={iconLockClose} alt="Desbloquear usuário" title='Desbloquear usuário' /> :
                                        <img src={iconLockOpen} alt="Bloquear usuário" title='Bloquear usuário' />
                                    }
                                </button>
                                <button className='action__archive' onClick={() => archiveUser(item.id)}>
                                    { !props.archived ? 
                                        <img src={iconArchiveRed} alt="Arquivar usuário" title='Arquivar usuário' /> : 
                                        <img src={iconArchiveGreen} alt="Desarquivar usuário" title='Desarquivar usuário' /> 
                                    }
                                </button>
                            </div>
                        }
                    </div>    
                ) }
            </div>
            { openModalBlock && <ModalBlockUser situation={userSituation.situacao} id={userSituation.id} /> }

            { !props.archived ? 
                <>
                    <div className="userList__archiveButton">
                        <Link to={'/users/archived'}>
                            <button className='archiveButton'>
                                <span>Usuários arquivados</span>
                                <img src={iconArchiveRed} alt="Usuários arquivados" />
                            </button>
                        </Link>
                        
                    </div>
                    {openModal && <Modal link={`/profile/${userSituation.id}`} title="Usuário arquivado com sucesso" />}
                </>
                
                :

                <>
                    <div className="userList__unarchiveButton">
                        <Link to={'/users'}>
                            <button className='unarchiveButton'>
                                <span>Voltar</span>
                            </button>
                        </Link>
                    </div>
                    {openModal && <Modal link={`/profile/${userSituation.id}`} title="Usuário desarquivado com sucesso" />}
                </>
            }
        </div>
    );
}

export default UserList;