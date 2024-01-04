import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ModalContainer from "../../../Components/Modal";
import useAdminProvider from "../../../Hooks/useAdminProvider";
import ErrorMessage from "../../../Utils/ErrorMessage";

import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';

import userProfile from '../../../Assets/user-profile.svg';
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

const initialError = {
    nome: false,
    nome_mensagem: '',
    email: false,
    email_mensagem: '',
    telefone: false,
    telefone_mensagem: '',
    categoria: false,
    categoria_mensagem: '',
}
const inititalUserData = {
    nome: "",
    email: "",
    telefone: "",
    categoria: [],
    imagem_url: "",
    situacao: "Aguardando confirmação"
}

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

const CadastrarUsuarioModal = ({ isOpen, onRequestClose, mostrarMensagemSucesso }) => {
    const { registerUserRequest, uploadImagemUsuarioRequest } = useAdminProvider();

    const [files, setFiles] = useState([]);
    const [imagem, setImagem] = useState('');

    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const theme = useTheme();

    const [ error, setError ] = useState(initialError);
    const [userData, setUserData] = useState(inititalUserData);

    const selecionarCategoria = (event) => {
        const {
          target: { value },
        } = event;
        setCategoriasSelecionadas(
          typeof value === 'string' ? value.split(',') : value,
        );
        setUserData({ ...userData, categoria: value });
    };

    function closeModal() {
        setError(initialError);
        setUserData(inititalUserData);
        onRequestClose();
    }
    
    const verify = (erro) => {  
        if(!erro && userData.imagem_url)
            uploadImagem();
            mostrarMensagemSucesso();
            closeModal();

        setError({ ...error, email: true, email_mensagem: erro  });
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
    
    const handleSubmit = async () => {          
        setError({
            nome: !userData.nome,
            nome_mensagem: !userData.nome && 'Nome é um campo obrigatório',
            email: !userData.email,
            email_mensagem: !userData.email && 'Email é um campo obrigatório',
            telefone: !userData.telefone,
            telefone_mensagem: !userData.telefone && 'Telefone é um campo obrigatório',
            categoria: userData.categoria.length === 0,
            categoria_mensagem: userData.categoria.length === 0 && 'Selecione uma ou mais categorias para o usuário',
        });
        
        if(userData.nome && userData.email && userData.telefone && userData.categoria.length > 0) {
            const response = await registerUserRequest(userData);
            verify(response);
        }
    }
    
    const uploadImagem = () => {
        const formData = new FormData();
        formData.append('imagem', imagem);
        uploadImagemUsuarioRequest(formData, userData.email);
    }

    useEffect(
        () => () => {
          files.forEach(file => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    return (
        <ModalContainer
            isOpen={isOpen}
            onRequestClose={closeModal}
            title="Cadastrar Usuário"
        >
            <div className='formUser__container'>
                <header className='formUser__header'>

                    {   userData.imagem_url === "" ?

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

                <form className='formUser__form' onSubmit={e => e.preventDefault()}>
                    <div className="formUser__row color-gray-dark">
                        <div className="formUser__field">
                            <label htmlFor="formUser__name" className='formUser__label'>Nome Completo</label>
                            <input id="formUser__name" 
                                type="text" 
                                className='formUser__input' 
                                value={userData.nome}
                                onChange={(e) => setUserData({ ...userData, nome: e.target.value })} />
                            { error.nome && <ErrorMessage message={error.nome_mensagem} /> }
                        </div>
                    </div>
                    <div className="formUser__row">
                        <div className="formUser__field">
                            <label htmlFor="formUser__email" className='formUser__label'>Email</label>
                            <input id="formUser__email" 
                                type="text" 
                                className='formUser__input' 
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                            { error.email && <ErrorMessage message={error.email_mensagem} /> }
                        </div>
                        <div className="formUser__field">
                            <label htmlFor="formUser__telefone" className='formUser__label'>Telefone</label>
                            <input id="formUser__telefone" 
                                type="text" 
                                className='formUser__input' 
                                value={userData.telefone}
                                onChange={(e) => setUserData({ ...userData, telefone: e.target.value })} />
                        { error.telefone && <ErrorMessage message={error.telefone_mensagem} /> }
                        </div>
                    </div>
                    <div className="formUser__row color-gray-dark">
                        <div className="formUser__field">
                            <label htmlFor="formUser__categoria" className='formUser__label'>Categoria</label>

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
                                        <Chip key={value} label={value} sx={{ fontSize: '1.2rem', backgroundColor: 'var(--green-primary)', color: 'var(--white)' }} />
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
                            { error.categoria && <ErrorMessage message={error.categoria_mensagem} /> }
                        </div>
                        <div className="formUser__field">
                            <label htmlFor="formUser__situacao" className='formUser__label'>Situação</label>
                            <input id="formUser__situacao" 
                                type="text" 
                                className='formUser__input' 
                                value={userData.situacao}
                                onChange={e => setUserData({ ...userData, situacao: e.target.value })}
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

export default CadastrarUsuarioModal;