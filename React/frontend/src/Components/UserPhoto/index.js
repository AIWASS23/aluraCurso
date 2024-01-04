import './styles.css';
import imagemPadrao from '../../Assets/user-profile.svg';
import useAdminProvider from '../../Hooks/useAdminProvider';

function UserPhoto({ imagem_url, max_size, path }) {

    const { url_server_imagem } = useAdminProvider();
    const caminhoImagem = `${url_server_imagem}${path}${imagem_url}`;

    return (    
        <div className='userphoto'>
            { imagem_url ?
                <figure className='photo__container' style={{padding: "0.5rem"}}> 
                    <img src={caminhoImagem} alt="Foto de perfil do usuário" className='photo__user' width={max_size-10} height={max_size-10} />
                </figure>
                
                : 
                
                <figure className='photo__container' style={{padding: "0.5rem"}}>
                    <img src={imagemPadrao} alt="Foto de perfil do usuário" className='photo__user' width={max_size-10} height={max_size-10} />
                </figure>
            }
                
        </div>       
    );
}

export default UserPhoto;