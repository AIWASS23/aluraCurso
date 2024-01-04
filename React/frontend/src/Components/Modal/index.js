import Modal from 'react-modal';

import iconClose from '../../Assets/btn-close-black.svg';

import './styles.css';

const ModalContainer = ({ isOpen, onRequestClose, title, children }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <header>
                <h2>{title}</h2>
                <button onClick={onRequestClose}>
                    <img src={iconClose} alt="Fechar modal" />
                </button>
            </header>

            {children}
        </Modal>
    );
}

export default ModalContainer;