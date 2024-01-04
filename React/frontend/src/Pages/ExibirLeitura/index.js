import { Link, useNavigate, useParams } from 'react-router-dom';
import PageDefault from '../../Utils/PageDefault';
import useAdminProvider from '../../Hooks/useAdminProvider';
import { useEffect, useState } from 'react';

import EditarLeituraModal from './EditarLeituraModal';
import Modal from '../../Utils/Modal';

import './styles.css';

const ExibirLeitura = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profileRequest, obterLeituraRequest, userLogin, detalhes } = useAdminProvider();

  const [mostrarEditarModal, setMostrarEditarModal] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mostrarModalSemAlteracao, setMostrarModalSemAlteracao] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await profileRequest();
      if (response.status === 401) {
        navigate('/unauthorized');
      }
    }

    fetchData();

    obterLeituraRequest(id);
  }, [mostrarModalSucesso, detalhes]);

  return (
    <PageDefault title="Leitura">
      <div className='userProfile__container'>
        <section className='info__container info__container-medidores'>
          <div className="container__column">
            <div className="info__field">
              <label htmlFor="info__numero-serie" className='info__label'>Nome do Cliente</label>
              <input id='info__numero-serie' type="text" className='info__input' value={detalhes.nome_cliente} disabled />
            </div>
            <div className="info__field">
              <label htmlFor="info__nome-cliente" className='info__label'>Logix</label>
              <input id='info__nome-cliente' type="text" className='info__input' value={detalhes.logix} disabled />
            </div>
            <div className="info__field">
              <label htmlFor="info__nome-cliente" className='info__label'>Status</label>
              <input id='info__nome-cliente' type="text" className='info__input' value={detalhes.status} disabled />
            </div> 
            <div className="info__field">
              <label htmlFor="info__nome-cliente" className='info__label'>Situação</label>
              <input id='info__nome-cliente' type="text" className='info__input' value={detalhes.arquivado ? "Arquivada" : "Ativa"} disabled />
            </div> 
          </div>
          <div className="container__column">
            <div className="info__field">
              <label htmlFor="info__nome-cliente" className='info__label'>Leiturista</label>
              <input id='info__nome-cliente' type="text" className='info__input' value={detalhes.nome_leiturista} disabled />
            </div> 
            <div className="info__field">
              <label htmlFor="info__cnpj-cliente" className='info__label'>Valor</label>
              <input id='info__cnpj-cliente' type="text" className='info__input' value={`${detalhes.valor} m³`} disabled />
            </div>
            <div className="info__field">
              <label htmlFor="info__cnpj-cliente" className='info__label'>Data</label>
              <input id='info__cnpj-cliente' type="text" className='info__input' value={`${detalhes.data} - ${detalhes.horario}`} disabled />
            </div>
          </div>
        </section>

        <div className="userProfile__buttons">
          {userLogin.categoria && userLogin.categoria.includes("Coordenador") || userLogin.categoria.includes("Administrador") &&
            <div className="button__edit --hidden">
              <button className='button --confirm' onClick={() => setMostrarEditarModal(true)}>Editar Leitura</button>
            </div>
          }

          <Link to={'/readings'}>
            <button className='button__back'>
              <span>Voltar</span>
            </button>
          </Link>
        </div>
      </div>

      {/* MODAL */}
      <EditarLeituraModal
        isOpen={mostrarEditarModal}
        onRequestClose={() => setMostrarEditarModal(false)}
        id_medidor={id}
        detalhes={detalhes}
        mostrarMensagemSucesso={() => setMostrarModalSucesso(true)}
        mostrarMensagemSemAlteracao={() => setMostrarModalSemAlteracao(true)}
      />
      {mostrarModalSucesso &&
        <Modal
          title="Leitura editada com sucesso"
          fecharModalManualmente={() => setMostrarModalSucesso(false)}
        />
      }
      {mostrarModalSemAlteracao &&
        <Modal
          title="Nenhuma alteração realizada"
          fecharModalManualmente={() => setMostrarModalSemAlteracao(false)}
        />
      }
    </PageDefault>
  );
}

export default ExibirLeitura;