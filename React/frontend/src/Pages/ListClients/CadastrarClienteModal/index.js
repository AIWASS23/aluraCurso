import { useEffect } from 'react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ModalContainer from '../../../Components/Modal';
import useAdminProvider from '../../../Hooks/useAdminProvider';
import ErrorMessage from '../../../Utils/ErrorMessage';
import userProfile from '../../../Assets/user-profile.svg';

import btnAddImage from "../../../Assets/btn-add.svg";

import './styles.css';

const thumb = {
  display: "inline-flex",
  width: "auto",
  height: 180,
  padding: 4,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  borderRadius: "50%"
};

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",  
};

const img = {
  display: "block",
  width: "17rem",
  height: "100%"
};

const initialUserData = {
  nome: '',
  cnpj: '',
  logix: '',
  arquivado: false,
  imagem_url: ''
}

const initialErrors = {
  nome: false,
  nome_mensagem: '',
  cnpj: false,
  cnpj_mensagem: '',
  logix: false,
  logix_mensagem: ''
}

const CadastrarClienteModal = ({ isOpen, onRequestClose, mostrarMensagemSucesso }) => {
  const { cadastrarClienteRequest, uploadImagemClienteRequest } = useAdminProvider();

  const [files, setFiles] = useState([]);
  const [imagem, setImagem] = useState('');

  const cnpjMask = (value) => {
    return value
      .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
      .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2') // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1') // captura os dois últimos 2 números, com um - antes dos dois números
    }

  const [userData, setUserData] = useState(initialUserData);

  const [error, setError] = useState(initialErrors);

  const validarResponse = (response) => {
    if(response.error_path === "cnpj") {
      setError({ cnpj: true, cnpj_mensagem: response.mensagem });
    }
    if(response.error_path === "logix") {
      setError({  logix: true, logix_mensagem: response.mensagem });
    }
  }

  const toggleCheckbox = () => {
    userData.arquivado ? setUserData({ ...userData, arquivado: false }) : setUserData({ ...userData, arquivado: true });
  }

  function closeModal() {
    setUserData(initialUserData);
    setError(initialErrors);
    onRequestClose();
  }

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    maxFiles: 1,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg'],
      'image/pjpeg': ['.pjpeg'],
      'image/jpg': ['.jpg']
    },
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
      setUserData({ ...userData, imagem_url: acceptedFiles[0].path });
      setImagem(acceptedFiles[0]);
    }
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  const uploadImagem = () => {
    const formData = new FormData();
    formData.append('imagem', imagem);
    uploadImagemClienteRequest(formData, userData.logix)
  }

  const handleSubmit = async () => {
    setError({
      nome: !userData.nome,
      nome_mensagem: "O campo nome é obrigatório",
      cnpj: !userData.cnpj,
      cnpj_mensagem: "O campo CNPJ é obrigatório",
      logix: !userData.logix,
      logix_mensagem: "O campo Número LOGIX é obrigatório"
    });

    if(userData.nome && userData.cnpj && userData.logix) {
      const response = await cadastrarClienteRequest(userData);
      if(response === 201) {
        userData.imagem_url && uploadImagem();
        mostrarMensagemSucesso();
        closeModal();
      } else {
        validarResponse(response);
      }
    }
  }

  useEffect(
    () => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <ModalContainer isOpen={isOpen} onRequestClose={closeModal} title="Cadastrar cliente">
      <div className="formUser__container">
        <header className='formUser__header'>
          {
            userData.imagem_url === "" ?
              <figure className='photo__container'>
                  <img src={userProfile} alt="Foto de perfil do usuário" className='photo__user' style={{ padding: "2rem" }} />
              </figure>
              :
              <figure className='photo__container' style={thumbsContainer}>
                  {thumbs}
              </figure>
          }
          <div className='btn__add' {...getRootProps()}>
            <input {...getInputProps()} />
            <label htmlFor="imagem" className='--upload-button'>
                <img src={btnAddImage} alt="Imagem do usuário" />
            </label>
          </div>
        </header>
        <form action="" className='formUser__form' onSubmit={e => e.preventDefault()}>
          <div className="formUser__field">
            <label htmlFor="formUser__name" className='formUser__label'>Nome do Cliente</label>
            <input
              id="formUser__name" 
              type="text" 
              className='formUser__input'
              placeholder="Nome do Cliente" 
              value={userData.nome}
              onChange={(e) => setUserData({ ...userData, nome: e.target.value })} />
            { error.nome && <ErrorMessage message={error.nome_mensagem} /> }
          </div>
          <div className="formUser__field">
            <label htmlFor="formUser__cnpj" className='formUser__label'>CNPJ</label>
            <input
              id="formUser__cnpj" 
              type="text" 
              className='formUser__input'
              placeholder="0000000000/0000-0" 
              value={cnpjMask(userData.cnpj)}
              onChange={(e) => setUserData({ ...userData, cnpj: e.target.value })} />
            { error.cnpj && <ErrorMessage message={error.cnpj_mensagem} /> }
          </div>
          <div className="formUser__field">
            <label htmlFor="formUser__logix" className='formUser__label'>Número LOGIX</label>
            <input
              id="formUser__logix" 
              type="text" 
              className='formUser__input'
              placeholder="000000000000" 
              value={userData.logix}
              onChange={(e) => setUserData({ ...userData, logix: e.target.value })} />
            { error.logix && <ErrorMessage message={error.logix_mensagem} /> }
          </div>
          <div className="formUser__buttons__field">
            <button className='button --cancel' onClick={closeModal}>Cancelar</button>
            <button className='button --confirm' onClick={() => handleSubmit()}>Salvar</button>
          </div>
        </form>
      </div>
    </ModalContainer>
  )
}

export default CadastrarClienteModal;