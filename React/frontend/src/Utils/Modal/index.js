import './styles.css';
import { Link } from 'react-router-dom';
import btnCloseGreen from '../../Assets/btn-close-green.svg';
import useAdminProvider from '../../Hooks/useAdminProvider';

function Modal(props) {
    const { setOpenModal } = useAdminProvider();

    function closeModal() {
        setOpenModal(false);

        if (props.fecharModalManualmente) {
            props.fecharModalManualmente()
        }
    }

    return (
        <div className='modal__background'>
            <div className="modal__container">
                <div className="modal__exit" onClick={closeModal}>
                    {props.link !== undefined ? (
                        <Link to={props.link}>
                            <img src={btnCloseGreen} alt="Fechar modal" />
                        </Link>
                    ) : (
                        <img src={btnCloseGreen} alt="Fechar modal" />
                    )}
                </div>
                <div className="modal__message">
                    <h1 className={`modal__title ${props.recover_password && '--recover-password'}`}>{props.title}</h1>
                    <h2 className='modal__subtitle'>{props.subtitle}</h2>
                </div>
            </div>
        </div>
    );
}

export default Modal;