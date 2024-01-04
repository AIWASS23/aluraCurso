import { Link, useNavigate, useParams } from 'react-router-dom';
import PageDefault from '../../Utils/PageDefault';
import useAdminProvider from '../../Hooks/useAdminProvider';
import { useEffect, useState } from 'react';

import './styles.css';
import EditarMedidorModal from './EditarMedidorModal';
import Modal from '../../Utils/Modal';

const ExibirMedidor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profileRequest, exibirDetalhesMedidorRequest, userLogin, detalhes } = useAdminProvider();

    const [mostrarEditarModal, setMostrarEditarModal] = useState(false);
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

        exibirDetalhesMedidorRequest(id);
    }, [mostrarModalSucesso]);

    return (
        <PageDefault title="Medidor">
            <div className='userProfile__container'>
                <section className='info__container info__container-medidores'>
                    <div className="container__column">
                        <div className="info__field">
                            <label htmlFor="info__numero-serie" className='info__label'>Número de série</label>
                            <input id='info__numero-serie' type="text" className='info__input' value={detalhes.numero_serie} disabled />
                        </div>
                        <div className="info__field">
                            <label htmlFor="info__nome-cliente" className='info__label'>Nome do cliente</label>
                            <input id='info__nome-cliente' type="text" className='info__input' value={detalhes.nome_cliente} disabled />
                        </div>
                        <div className="info__field">
                            <label htmlFor="info__cnpj-cliente" className='info__label'>CNPJ do cliente</label>
                            <input id='info__cnpj-cliente' type="text" className='info__input' value={detalhes.cnpj_cliente} disabled />
                        </div>
                        <div className="info__field">
                            <label htmlFor="info__gps" className='info__label'>Posição GPS</label>
                            <input id='info__gps' type="text" className='info__input' value={detalhes.gps} disabled />
                        </div>
                        <div className="info__field">
                            <label htmlFor="info__status" className='info__label'>Status</label>
                            <input id='info__status' type="text" className='info__input' value={detalhes.arquivado ? "Arquivado" : "Ativo" } disabled />
                        </div>
                    </div>

                    <div className="container__column">
                        <div className="info__field">
                            <label htmlFor="info__ultima-leitura" className='info__label'>Valor da última leitura</label>
                            <input id='info__ultima-leitura' type="text" className='info__input' value={detalhes.ultima_leitura + " m³"} disabled />
                        </div>
                        <div className="info__field">
                            <label htmlFor="info__percentual-variacao" className='info__label'>Percentual de variação</label>
                            <input id='info__percentual-variacao' type="text" className='info__input' value={detalhes.percentual_variacao*100 + " %"} disabled />
                        </div>
                        <div className="info__field">
                            <label htmlFor="info__ptz" className='info__label'>Medidor possui PTZ</label>
                            <input id='info__ptz' type="text" className={`info__input ${detalhes.ptz ? '--ptz-true' : '--ptz-false'}`} value={detalhes.ptz ? "Sim" : "Não"} disabled />
                        </div>
                        <div className="info__field">
                            <label htmlFor="info__qr-code" className='info__label'>Abrir chamado</label>
                            <a target="_blank" href={detalhes.qr_code} rel="noreferrer">Acessar página</a>
                        </div>
                    </div>
                </section>

                <div className="userProfile__buttons">
                    
                    {userLogin.categoria && userLogin.categoria.includes("Coordenador") || userLogin.categoria.includes("Administrador") &&
                        <div className="button__edit">
                            <button className='button --confirm' onClick={() => setMostrarEditarModal(true)}>Editar Medidor</button>
                        </div>
                    } 
                    
                    <Link to={'/medidores'}>
                        <button className='button__back'>
                            <span>Voltar</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* MODAL */}
            <EditarMedidorModal
                isOpen={mostrarEditarModal}
                onRequestClose={() => setMostrarEditarModal(false)}
                id_medidor={id}
                detalhes={detalhes}
                mostrarMensagemSucesso={() => setMostrarModalSucesso(true)}
                mostrarMensagemSemAlteracao={() => setMostrarModalSemAlteracao(true)}
            />
            { mostrarModalSucesso && 
                <Modal 
                    title="Medidor editado com sucesso"
                    fecharModalManualmente={() => setMostrarModalSucesso(false)} 
                /> 
            }
            { mostrarModalSemAlteracao && 
                <Modal 
                    title="Nenhuma alteração realizada"
                    fecharModalManualmente={() => setMostrarModalSemAlteracao(false)}
                /> 
            }
        </PageDefault>
    );
}

export default ExibirMedidor;