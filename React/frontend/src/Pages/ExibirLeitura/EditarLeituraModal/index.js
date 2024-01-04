import { Autocomplete } from "@material-ui/core";
import { useEffect, useState } from "react";
import ModalContainer from "../../../Components/Modal";
import useAdminProvider from "../../../Hooks/useAdminProvider";
import ErrorMessage from '../../../Utils/ErrorMessage';
import './styles.css';

const errosValoresIniciais = {
  imagem_leitura: false,
  imagem_leitura_message: '',
  id_medidor: false,
  id_medidor_message: '',
  valor: false,
  valor_message: '',
}

const EditarLeituraModal = ({ isOpen, onRequestClose, id_medidor, mostrarMensagemSucesso, mostrarMensagemSemAlteracao, detalhes }) => {
  const { listarClientesDropdownRequest, editarMedidorRequest } = useAdminProvider();
  const [valueCombobox, setValueCombobox] = useState();
  const [imageFilename, setImageFilename] = useState("");

  const [options, setOptions] = useState([]);
  const [userData, setUserData] = useState({});
  const [editBody, setEditBody] = useState();

  useEffect(() => {
    async function fetchData() {
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

    fetchData();

  }, [detalhes]);

  function closeModal() {
    onRequestClose();
    setEditBody();
    setError(errosValoresIniciais);
  }

  const [error, setError] = useState(errosValoresIniciais);

  const handleSubmit = async () => {
    setError({
      imagem_leitura: !userData.imagem_leitura,
      imagem_leitura_message: "Selecione uma imagem",
      id_medidor: !userData.id_medidor,
      id_medidor_message: "Selecione um medidor",
      valor: !userData.valor,
      valor_message: "O valor é obrigatório",
    });

    if (!editBody) {
      mostrarMensagemSemAlteracao();
      closeModal();
    }

    if (editBody.id_cliente || editBody.numero_serie || editBody.gps || editBody.ultima_leitura || editBody.qr_code || editBody.percentual_variacao || typeof (editBody.ptz) === 'boolean' || typeof (editBody.arquivado) === 'boolean') {
      const response = await editarMedidorRequest(id_medidor, editBody);
      validarResponse(response);
    }
  }

  const validarResponse = (response) => {
    if (response === "Medidor alterado com sucesso") {
      mostrarMensagemSucesso();
      closeModal();
    }
  }

  const escolherCliente = (value) => {
    setUserData({ ...userData, id_cliente: value.id });
  }

  function handleUpdateImage(event) {
    setImageFilename(event.target.files[0].name)
  }

  return (
    <ModalContainer isOpen={isOpen} onRequestClose={closeModal} title="Editar Leitura">
      <div className="formRegisterGasMeter__container">
        <form action="" className='formUser__form' onSubmit={e => e.preventDefault()}>
          <div className="formUser__row">
            <div className="formUser__field">
              <label className='formUser__label'>Imagem</label>
              <input
                id="image"
                type="file"
                name="avatar"
                accept="image/png, image/jpeg"
                onChange={handleUpdateImage}
              />
              <label className="inputImageLabel" htmlFor="image">
                {imageFilename === "" ? "Escolha uma imagem" : imageFilename}
              </label>
              {error.imagem_leitura && <ErrorMessage message={error.imagem_leitura_message} />}
            </div>
          </div>
          <div className="formUser__row">
            <div className="formUser__field">
              <label htmlFor="formUser__name" className='formUser__label'>Medidor</label>
              <Autocomplete
                options={options}
                sx={{
                  border: "none",
                  '& input': {
                    width: "100%"
                  },
                }}
                value={valueCombobox}
                onChange={(event, value) => escolherCliente(value)}
                renderInput={(params) => <div ref={params.InputProps.ref}>
                  <input type="text" className='formUser__input' placeholder="Selecione um medidor" {...params.inputProps} />
                </div>}
              />
              {error.id_medidor && <ErrorMessage message={error.id_medidor_message} />}
            </div>
            <div className="formUser__field">
              <label htmlFor="formUser__serial-number" className='formUser__label'>Valor</label>
              <input id="formUser__serial-number"
                type="number"
                className='formUser__input'
                placeholder="m³"
                value={userData.numero_serie}
                onChange={(e) => setUserData({ ...userData, valor: e.target.value })} />
              {error.valor && <ErrorMessage message={error.valor_message} />}
            </div>
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

export default EditarLeituraModal;