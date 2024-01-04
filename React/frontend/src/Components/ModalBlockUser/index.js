import btnCloseGreen from '../../Assets/btn-close-green.svg';
import useAdminProvider from '../../Hooks/useAdminProvider';
import { Link } from 'react-router-dom'

function ModalBlockUser(props) {
    const { setOpenModalBlock } = useAdminProvider();

    return (
        <div className='modal__background'>
            <div className="modal__container">
                <div className="modal__exit" onClick={() => setOpenModalBlock(false)}>
                    <Link to={`/profile/${props.id}`}>
                        <img src={btnCloseGreen} alt="Fechar modal" />                    
                    </Link>
                </div>
                <div className="modal__message">
                    <h1 className="modal__title">Usuário {props.situation === 'Bloqueado' ? "desbloqueado" : "bloqueado"} com sucesso!</h1>
                </div>
            </div>
        </div>
    );
}

export default ModalBlockUser;