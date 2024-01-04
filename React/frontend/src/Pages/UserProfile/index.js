import { Link, useNavigate, useParams } from 'react-router-dom';
import PageDefault from '../../Utils/PageDefault';
import useAdminProvider from '../../Hooks/useAdminProvider';
import { useEffect, useState } from 'react';
import UserPhoto from '../../Components/UserPhoto';

import './styles.css';
import EditUserModal from './EditUserModal';
import Modal from '../../Utils/Modal';

const UserProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profileRequest, getUserRequest, detalhes, converterCategoria, userLogin } = useAdminProvider();

    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
    const [mostrarModalSemAlteracao, setMostrarModalSemAlteracao] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await profileRequest();
            if(response.status === 401) {
                navigate('/unauthorized');
            }
        }

        fetchData();
        getUserRequest(id);
    }, [mostrarModalSucesso]);

    return (
        <PageDefault title="Perfil">
            <div className='userProfile__container'>
                <header className='header'>
                    <UserPhoto  max_size={139} imagem_url={detalhes.imagem_url} path="usuario/" />
                    <h2 className='header__username'>{detalhes.nome}</h2>
                </header>
                <section className='info__container'>
                    <div className="info__field">
                        <label htmlFor="info__email" className='info__label'>Email</label>
                        <input id='info__email' type="text" className='info__input' value={detalhes.email} disabled />
                    </div>
                    <div className="info__field">
                        <label htmlFor="info__phone" className='info__label'>Telefone</label>
                        <input id='info__phone' type="text" className='info__input' value={detalhes.telefone} disabled />
                    </div>
                    <div className="info__field">
                        <label htmlFor="info__category" className='info__label'>Categoria</label>
                        <input id='info__category' type="text" className='info__input' value={detalhes.categoria} disabled />
                    </div>
                    <div className="info__field">
                        <label htmlFor="info__situation" className='info__label'>Situação</label>
                        <input id='info__situation' type="text" className='info__input' value={detalhes.situacao} disabled />
                    </div>
                </section>
                <div className="userProfile__buttons">
                    {userLogin.categoria && userLogin.categoria.includes("Administrador") &&
                        <div className="button__edit" onClick={() => setShowEditUserModal(true)}>
                            <button className='button --confirm'>Editar perfil</button>
                        </div>
                    } 
                    
                    <Link to={'/users'}>
                        <button className='button__back'>
                            <span>Voltar</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* MODAL */}
            <EditUserModal
                isOpen={showEditUserModal}
                onRequestClose={() => setShowEditUserModal(false)}
                userId={id}
                detalhes={detalhes}
                mostrarMensagemSucesso={() => setMostrarModalSucesso(true)}
                mostrarMensagemSemAlteracao={() => setMostrarModalSemAlteracao(true)}
            />
            { mostrarModalSucesso && (
                <Modal
                    title="Usuário editado com sucesso"
                    fecharModalManualmente={() => setMostrarModalSucesso(false)}
                />
            ) }
            { mostrarModalSemAlteracao && (
                <Modal
                    title="Nenhuma alteração realizada"
                    fecharModalManualmente={() => setMostrarModalSemAlteracao(false)}
                />
            ) }
        </PageDefault>
    );
}

export default UserProfilePage;