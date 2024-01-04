import './styles.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAdminProvider from '../../Hooks/useAdminProvider';
import Multiselect from 'multiselect-react-dropdown';
import ErrorMessage from '../../Utils/ErrorMessage';
import Modal from '../../Utils/Modal';
import btnAddImage from '../../Assets/btn-add.svg';
import userProfile from '../../Assets/user-profile.svg';
import {useDropzone} from 'react-dropzone';

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

function FormUserRegister() {
    const { registerUserRequest, uploadImagemUsuarioRequest, openModal } = useAdminProvider();

    const [files, setFiles] = useState([]);
    const [imagem, setImagem] = useState('');

    const [ error, setError ] = useState({
        nome: false,
        nome_mensagem: '',
        email: false,
        email_mensagem: '',
        telefone: false,
        telefone_mensagem: '',
        categoria: false,
        categoria_mensagem: '',
    });

    const [userData, setUserData] = useState({
        nome: "",
        email: "",
        telefone: "",
        categoria: [],
        imagem_url: "",
        situacao: "Aguardando confirmação"
    });

    
    const categoriaOptions = [
        { nome: 'Administrador', id: 1 },
        { nome: 'Coordenador', id: 2 }, 
        { nome: 'Leiturista', id: 3 }
    ];
    
    const multiSelectStyle = {
        searchBox: {
            border: 'none',
            padding: 0,
            margin: 0
        },
        chips: {
            background: 'var(--green-primary)'
        }
    }
    
    const onSelect = (selectedItem) => {
        setUserData({ ...userData, categoria: selectedItem });
    }
    
    const verify = (erro) => {  
        if(!erro && userData.imagem_url)
            uploadImagem();

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
                <div className="formUser__field">
                    <label htmlFor="formUser__name" className='formUser__label'>Nome Completo</label>
                    <input id="formUser__name" 
                        type="text" 
                        className='formUser__input' 
                        value={userData.nome}
                        onChange={(e) => setUserData({ ...userData, nome: e.target.value })} />
                    { error.nome && <ErrorMessage message={error.nome_mensagem} /> }
                </div>
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
                <div className="formUser__field">
                    <label htmlFor="formUser__categoria" className='formUser__label'>Categoria</label>
                    <Multiselect id="formUser__categoria" 
                        options={categoriaOptions}
                        placeholder=""
                        displayValue='nome'
                        className='formUser__input' 
                        onSelect={(e) => onSelect(e)}
                        closeIcon='cancel'
                        style={multiSelectStyle} />
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
                <div className="formUser__buttons__field">
                    <Link to='/dashboard'>
                        <button className='button --cancel'>Cancelar</button>
                    </Link>
                    <button className='button --confirm' onClick={() => handleSubmit()}>Salvar</button>
                </div>
            </form>
            { openModal && <Modal title="Usuário cadastrado com sucesso" link="/users" />}
        </div>
    );
}

export default FormUserRegister;