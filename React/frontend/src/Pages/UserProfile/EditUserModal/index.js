import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ModalContainer from "../../../Components/Modal";
import UserPhoto from "../../../Components/UserPhoto";
import useAdminProvider from "../../../Hooks/useAdminProvider";
import ErrorMessage from "../../../Utils/ErrorMessage";

import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';

import btnAddImage from '../../../Assets/btn-add.svg';

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
  nome: "",
  email: "",
  telefone: "",
  categoria: "",
  imagem_url: "",
  situacao: "",
}

const initialError = {
  nome: '',
  error_nome: false,
  email: '',
  error_email: false,
  telefone: '',
  error_telefone: false,
  categoria: '',
  error_categoria: false,
};

const categoriaOptions = [
  'Administrador',
  'Coordenador',
  'Leiturista'
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(categoria, categoriasSelecionadas, theme) {
  return {
      fontWeight: categoriasSelecionadas.indexOf(categoria) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
      fontSize: '1.4rem'
  
  };
}

const EditUserModal = ({ isOpen, onRequestClose, userId, detalhes, mostrarMensagemSucesso, mostrarMensagemSemAlteracao }) => {
  const { editUserRequest, uploadImagemUsuarioRequest } = useAdminProvider();

  const [editBody, setEditBody] = useState({});

  const [files, setFiles] = useState([]);
  const [imagem, setImagem] = useState('');

  const [userData, setUserData] = useState(initialUserData);

  const [error, setError] = useState(initialError);

  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const theme = useTheme();

  // const categoriasIds = {
  //   Administrador: 1,
  //   Coordenador: 2,
  //   Leiturista: 3,
  // }

  const selecionarCategoria = (event) => {
    const {
      target: { value },
    } = event;
    setCategoriasSelecionadas(
      typeof value === 'string' ? value.split(',') : value,
    );
    setUserData({ ...userData, categoria: value });
  };

  useEffect(() => {
    // const categoriasSelecionadas = [];
    // detalhes.categoria.forEach(cat => {
    //   categoriasSelecionadas.push({
    //     nome: cat,
    //     id: categoriasIds[cat],
    //   });
    // });

    setUserData({
      nome: detalhes.nome,
      email: detalhes.email,
      telefone: detalhes.telefone,
      categoria: detalhes.categoria,
      imagem_url: detalhes.imagem_url,
      situacao: detalhes.situacao,
    });
  }, [detalhes]);

  const multiSelectStyle = {
    searchBox: {
      border: 'none',
      padding: 0,
      margin: 0
    },
    chips: {
      background: 'var(--green-primary)'
    },
    optionContainer: { // To change css for option container 
      width:'50rem'
    },
    optionListContainer: {
      width: 0
    }
  }

  function closeModal() {
    setError(initialError);
    onRequestClose();
  }

  // const onSelect = (selectedItem) => {
  //   setUserData({ ...userData, categoria: selectedItem });
  //   setEditBody({ ...editBody, categoria: selectedItem });
  // }

  // const onRemove = (selectedList, removedItem) => {
  //   setUserData({ ...userData, categoria: removedItem });
  //   setEditBody({ ...editBody, categoria: removedItem });
  // }

  const verify = (response) => {
    if(response === 'Email inválido') {
      setError({ ...error, email: true, email_message: 'Por favor, insira um email válido' });
    }
    if(response === 'Este email já está em uso') {
      setError({ ...error, email: true, email_message: 'Este email já está em uso' });
    }
    if(response === "Não é possível alterar o email. Esta conta já foi confirmada") {
      setError({ ...error, email: true, email_message: 'Não é possível alterar o email de usuários com cadastro confirmado' });
    }
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
      setEditBody({ ...editBody, imagem_url: acceptedFiles[0].path });
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
    uploadImagemUsuarioRequest(formData, userData.email);
  }

  const handleSubmit = async () => {
    setError({
      nome: !userData.nome,
      nome_message: !userData.nome && 'Nome é um campo obrigatório',
      email: !userData.email,
      email_message: !userData.email && 'Email é um campo obrigatório',
      telefone: !userData.telefone,
      telefone_message: !userData.telefone && 'Telefone é um campo obrigatório',
      categoria: userData.categoria.length === 0,
      categoria_message: userData.categoria.length === 0 && 'Selecione uma ou mais categorias para o usuário',
    });
      
    if(editBody.nome || editBody.email || editBody.telefone || editBody.categoria || editBody.imagem_url) {
      let editBodyRequest = { ...editBody };

      if (editBody.categoria !== undefined) {
        editBodyRequest = { ...editBody, categoria: editBody.categoria.map(cat => cat.nome) }
      }

      const response = await editUserRequest(editBodyRequest, userId);
      verify(response);
      if(editBody.imagem_url) {
          uploadImagem();
      }
      mostrarMensagemSucesso();
      closeModal();
    } else {
      mostrarMensagemSemAlteracao();
      closeModal();
    }
  }

  useEffect(
    () => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <ModalContainer isOpen={isOpen} onRequestClose={closeModal} title="Editar usuário">
      <div className='formUser__container'>
        <header className='formUser__header'>
          {!editBody.imagem_url ? 
            <UserPhoto imagem_url={detalhes.imagem_url} max_size={169} path="usuario/" />
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
          <div className="formUser__row color-gray-dark">
            <div className="formUser__field">
              <label htmlFor="formUser__name" className='formUser__label'>Nome Completo</label>
              <input
                id="formUser__name" 
                type="text" 
                className='formUser__input' 
                value={userData.nome}
                onChange={(e) => {setUserData({ ...userData, nome: e.target.value }); setEditBody({ ...editBody, nome: e.target.value })}} />
              { error.nome && <ErrorMessage message={error.nome_message} /> }
            </div>
          </div>
          <div className="formUser__row">
            <div className="formUser__field">
              <label htmlFor="formUser__email" className='formUser__label'>Email</label>
              <input
                id="formUser__email" 
                type="text" 
                className='formUser__input' 
                value={userData.email}
                onChange={(e) => {setUserData({ ...userData, email: e.target.value }); setEditBody({ ...editBody, email: e.target.value })}} />
              { error.email && <ErrorMessage message={error.email_message} /> }
            </div>
            <div className="formUser__field">
              <label htmlFor="formUser__phone" className='formUser__label'>Telefone</label>
              <input
                id="formUser__phone" 
                type="text" 
                className='formUser__input' 
                value={userData.telefone}
                onChange={(e) => {setUserData({ ...userData, telefone: e.target.value }); setEditBody({ ...editBody, telefone: e.target.value })}} />
              { error.telefone && <ErrorMessage message={error.telefone_message} /> }
            </div>
          </div>
          <div className="formUser__row">
            <div className="formUser__field">
              <label htmlFor="formUser__category" className='formUser__label'>Categoria</label>
              {/* <Multiselect id="formUser__category" 
                options={categoryOptions}
                placeholder=""
                displayValue='nome'
                className='formUser__input'
                selectedValues={userData.categoria} 
                onSelect={(e) => onSelect(e)}
                onRemove={e => onRemove(userData.categoria, e)}
                closeIcon='cancel'
                style={multiSelectStyle} /> */}

                <Select
                  labelId="demo-multiple-chip-label"
                  id="multiselect-categoria"
                  multiple
                  value={categoriasSelecionadas}
                  onChange={selecionarCategoria}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                          <Chip key={value} 
                          label={value} 
                          sx={{ fontSize: '1.2rem', backgroundColor: 'var(--green-primary)', color: 'var(--white)' }} />
                      ))}
                      </Box>
                  )}
                  MenuProps={MenuProps}
                  >
                  {categoriaOptions.map((categoria) => (
                      <MenuItem
                      key={categoria}
                      value={categoria}
                      style={getStyles(categoria, categoriasSelecionadas, theme)}
                      >
                      {categoria}
                      </MenuItem>
                  ))}
              </Select>

              { error.categoria && <ErrorMessage message={error.categoria_message} /> }
            </div>
            <div className="formUser__field">
              <label htmlFor="formUser__situation" className='formUser__label'>Situação</label>
              <input
                id="formUser__situation" 
                type="text" 
                className='formUser__input' 
                value={userData.situacao}
                disabled />
            </div>
          </div>
          <div className="formUser__buttons__field">
            <button className='button --cancel' onClick={() => closeModal()}>Cancelar</button>
            <button className='button --confirm' onClick={() => handleSubmit()}>Salvar</button>
          </div>
        </form>
      </div>
    </ModalContainer>
  );
}

export default EditUserModal;