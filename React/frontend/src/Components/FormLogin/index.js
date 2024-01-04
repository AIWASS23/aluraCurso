import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAdminProvider from '../../Hooks/useAdminProvider';
import ErrorMessage from '../../Utils/ErrorMessage';
import './styles.css';

function FormLogin() {

    const { loginRequest } = useAdminProvider();
    const [user, setUser] = useState({
        email: '',
        senha: ''
    });

    const [error, setError] = useState({
        email: false,
        email_message: '',
        senha: false,
        senha_message: ''
    });

    const navigate = useNavigate();

    const verify = (response) => {
        setError({
            email: !user.email,
            email_message: "Email é um campo obrigatório",
            senha: !user.senha,
            senha_message: "Senha é um campo obrigatório"
        });

        if(response.error_senha === 'A senha deve conter, no mínimo, 8 caracteres') {
            setError({ ...error, senha: true, senha_message: 'A senha deve conter, no mínimo, 8 caracteres' });
        }
        if(response.error_senha === 'A senha deve conter pelo menos uma letra maiúscula e um número') {
            setError({ ...error, senha: true, senha_message: 'A senha deve conter pelo menos uma letra maiúscula e um número' });
        }
        if(response.error_email === 'Email inválido') {
            setError({ ...error, email: true, email_message: 'Por favor, insira um email válido' });
        }
        if(response === 'Senha inválida') {
            setError({ ...error, senha: true, senha_message: 'Senha incorreta' });
        }
        if(response === 'Usuário não encontrado') {
            setError({ ...error, email: true, email_message: 'Usuário não encontrado' });
        }
        if(response === 'Você não tem permissão para acessar o sistema') {
            setError({ ...error, email: true, email_message: 'Usuário bloqueado: você não tem permissão para acessar o sistema. Informe-se com um administrador' });
        }
    }

    const handleSubmit = async () => {
        const response = await loginRequest(user);
        verify(response);
        if(response.auth) {
            navigate('/dashboard');
        }
    }

    return (
        <div className='form__container'>
            <div className="form__header">
                <h1 className='form__title'>Seja Bem-vindo</h1>
            </div>

            <form method='POST' onSubmit={e => e.preventDefault()}>
                <div className="form__field">
                    <label htmlFor="input__user" className="form__label">Usuário</label>
                    <input
                        type="text"
                        id="input__user"
                        name="email" 
                        className="form__input" 
                        placeholder="Insira seu email"
                        value={user.email}
                        onChange={e => setUser({ ...user, email: e.target.value })}
                    />
                    { error.email && <ErrorMessage message={error.email_message} login /> }
                </div>
                <div className="form__field">
                    <label htmlFor="input__password" className="form__label" >Senha</label>
                    <input
                        type="password"
                        id="input__password"
                        name="senha"
                        className="form__input"
                        value={user.senha}
                        onChange={e => setUser({ ...user, senha: e.target.value })}
                    />
                    { error.senha && <ErrorMessage message={error.senha_message} login/> }
                </div>
                <div className="forgot__password">
                    <Link to='/recover_password'>Esqueci minha senha</Link>
                </div>
                <div className="submit__button">
                    <button type="submit" className='button --home' onClick={() => handleSubmit()} >ENTRAR</button>
                </div>
            </form>
        </div>
    );
}

export default FormLogin;