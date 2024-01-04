import { Link, useNavigate, useParams } from 'react-router-dom';
import PageDefault from '../../Utils/PageDefault';
import useAdminProvider from '../../Hooks/useAdminProvider';
import { useEffect, useState } from 'react';

import './styles.css';
import UserPhoto from '../../Components/UserPhoto';
import EditarClienteModal from './EditarClienteModal';
import Modal from '../../Utils/Modal';

const ExibirCliente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profileRequest, exibirDetalhesClienteRequest, userLogin, detalhes } = useAdminProvider();

    const [mostrarEditarClienteModal, setMostrarEditarClienteModal] = useState(false);
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
        exibirDetalhesClienteRequest(id);
    }, [mostrarModalSucesso]);

    return (
        <PageDefault title="Cliente">
            <div className='userProfile__container'>
                <header className='header'>
                    <UserPhoto max_size={139} imagem_url={detalhes.imagem_url} path="cliente/" />
                    <h2 className='header__username'>{detalhes.nome}</h2>
                </header>
                <section className='info__container info__container-medidores'>
                    <div className="container__column">
                        <div className="info__field">
                            <label htmlFor="info__cnpj-cliente" className='info__label'>CNPJ do cliente</label>
                            <input id='info__cnpj-cliente' type="text" className='info__input' value={detalhes.cnpj} disabled />
                        </div>
                        <div className="info__field">
                            <label htmlFor="info__logix-cliente" className='info__label'>Logix</label>
                            <input id='info__logix-cliente' type="text" className='info__input' value={detalhes.logix} disabled />
                        </div>
                        <div className="info__field">
                            <label htmlFor="info__situacao-cliente" className='info__label'>Status</label>
                            <input id='info__situacao-cliente' type="text" className='info__input' value={detalhes.arquivado ? "Arquivado" : "Ativo" } disabled />
                        </div>
                    </div>
                </section>
                <div className="userProfile__buttons">
                    {userLogin.categoria && userLogin.categoria.includes("Coordenador") || userLogin.categoria.includes("Administrador") &&
                        <div className="button__edit">
                            <button className='button --confirm' onClick={() => setMostrarEditarClienteModal(true)}>Editar Cliente</button>
                        </div>
                    }
                    
                    <Link to={'/clientes'}>
                        <button className='button__back'>
                            <span>Voltar</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* MODAL */}
            <EditarClienteModal
                isOpen={mostrarEditarClienteModal}
                onRequestClose={() => setMostrarEditarClienteModal(false)}
                idCliente={id}
                detalhes={detalhes}
                mostrarMensagemSucesso={() => setMostrarModalSucesso(true)}
                mostrarMensagemSemAlteracao={() => setMostrarModalSemAlteracao(true)}
            />
            { mostrarModalSucesso && (
                <Modal
                    title="Cliente editado com sucesso"
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

export default ExibirCliente;