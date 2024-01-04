import { useState } from 'react';
import ErrorMessage from '../../Utils/ErrorMessage';
import useAdminProvider from '../../Hooks/useAdminProvider';
import Modal from '../../Utils/Modal';

function FormUserVerify(props) {
    const { verifyUserRequest } = useAdminProvider();

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState({
        nova_senha: false,
        nova_senha_message: '',
        confirmar_senha: false,
        confirmar_senha_message: ''
    });
    
    const [password, setPassword] = useState({
        nova_senha: '',
        confirmar_senha: ''
    })

    const verify = (response) => {
        if(response.mensagem === "A senha deve conter, no mínimo, 8 caracteres com pelo menos uma letra maiúscula, uma minúscula e um número" && response.error_path === "password") {
            setError({ ...password, nova_senha: true, nova_senha_message: "A senha deve conter no mínimo 8 caracteres, com pelo menos um número, uma letra maiúscula e uma minúscula" });
        }
        if(response.mensagem === "A senha deve conter, no mínimo, 8 caracteres com pelo menos uma letra maiúscula, uma minúscula e um número" && response.error_path === "confirmar_senha") {
            setError({ ...password, confirmar_senha: true, confirmar_senha_message: "A senha deve conter no mínimo 8 caracteres, com pelo menos um número, uma letra maiúscula e uma minúscula" });
        }
        if(response.mensagem === "As senhas não coincidem" && response.error_path === "confirmar_senha") {
            setError({ ...password, confirmar_senha: true, confirmar_senha_message: "As senhas não coincidem" });
        }
        if(response.mensagem === "Usuário não encontrado") {
            setError({ ...password, confirmar_senha: true, confirmar_senha_message: "Usuário não encontrado. Não é possível cadastrar uma nova senha" });
        }
        if(response === "Senha criada com sucesso") setIsOpen(true);
    }

    const handleSubmit = async () => {
        setError({
            nova_senha: !password.nova_senha,
            nova_senha_message: "O campo senha é obrigatório",
            confirmar_senha: !password.confirmar_senha,
            confirmar_senha_message: "Por favor, confirme sua senha"
        })

        if(password.nova_senha && password.confirmar_senha) {
            const response = await verifyUserRequest(password, props.user);
            verify(response);
        }
    }

    return (
        <>
            {isOpen ? <Modal title="Sua nova senha foi criada com sucesso" link="/" /> : 
            <div className='form__container'>
                <div className="form__header --flex__center">
                    <h1 className='form__title'>Crie uma nova senha</h1>
                </div>
                <form action="POST" onSubmit={e => e.preventDefault()}>
                    <div className="form__field">
                        <label htmlFor="password" className='form__label'>Nova senha</label>
                        <input type="password" className='form__input' value={password.nova_senha} onChange={e => setPassword({ ...password, nova_senha: e.target.value })} />
                        {error.nova_senha && <ErrorMessage login message={error.nova_senha_message} />}
                    </div>
                    <div className="form__field">
                        <label htmlFor="email" className='form__label'>Confirmar senha</label>
                        <input type="password" className='form__input' value={password.confirmar_senha} onChange={e => setPassword({ ...password, confirmar_senha: e.target.value })} />
                        {error.confirmar_senha && <ErrorMessage login message={error.confirmar_senha_message} />}
                    </div>
                    <div className="submit__button">
                        <button type="submit" className='button --home' onClick={() => handleSubmit()}>Alterar senha</button>
                    </div>
                </form>
            </div>
            }
        </>
        
    );
}

export default FormUserVerify;