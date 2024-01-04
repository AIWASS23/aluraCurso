import { useState } from 'react';
import ErrorMessage from '../../Utils/ErrorMessage';
import useAdminProvider from '../../Hooks/useAdminProvider';
import Modal from '../../Utils/Modal';

function FormRecoverPassword() {
    const { recoverPasswordRequest } = useAdminProvider();

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState({
        isError: false,
        message: ''
    });
    const [email, setEmail] = useState('');

    const verify = (response) => {
        switch (response) {
            case "Este campo é obrigatório":
                setError({
                    isError: true,
                    message: "Email é um campo obrigatório"
                });
                break;
            case "Usuário não encontrado":
                setError({
                    isError: true,
                    message: "Usuário não encontrado"
                });
                break;
            case "Email em formato inválido":
                setError({
                    isError: true,
                    message: "Por favor, insira um email válido"
                });
                break;
            case `Email enviado para ${email}`:
                setIsOpen(true);
                break;
            default:
                break;
        }
    }

    const sendEmail = async () => {
        const response = await recoverPasswordRequest({ email: email });
        verify(response);
    }

    return (
        <>
            {isOpen ? <Modal recover_password title="Link enviado com sucesso" subtitle="Confira seu email e recupere sua senha" link="/" /> : 
            <div className='form__container'>
                <div className="form__header --flex__center">
                    <h1 className='form__title'>Digite seu email cadastrado</h1>
                    <h2 className='form__subtitle'>Enviaremaos um link  para recuperação da sua senha</h2>
                </div>
                <form action="POST" onSubmit={e => e.preventDefault()}>
                    <div className="form__field">
                        <label htmlFor="email" className='form__label'>Email</label>
                        <input type="text" className='form__input' value={email} onChange={e => setEmail(e.target.value)} />
                        {error.isError && <ErrorMessage login message={error.message} />}
                    </div>
                    <div className="submit__button">
                        <button type="submit" className='button --home' onClick={() => sendEmail()}>Enviar Link</button>
                    </div>
                </form>
            </div>
            }
        </>
        
    );
}

export default FormRecoverPassword;