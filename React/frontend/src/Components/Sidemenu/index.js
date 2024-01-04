import './styles.css';
import btnLogout from '../../Assets/btn-logout.svg';
import navbarGradient from '../../Assets/navbar-vector.svg';
import logo from '../../Assets/logo-white.svg';
import { Link } from 'react-router-dom';

import iconHome from '../../Assets/icon-home.svg';
import iconDocument from '../../Assets/icon-document-white.svg';
import iconUser from '../../Assets/icon-user.svg';
import iconLogout from '../../Assets/icon-logout.svg';
import useAdminProvider from '../../Hooks/useAdminProvider';

function Sidemenu() {
    const { logoutRequest, userLogin } = useAdminProvider();

    const logout = () => {
        logoutRequest();
    }

    return (
        <aside className='sidemenu'>

            <div className="sidemenu__small">
                <Link to='/dashboard'>
                    <img src={iconHome} alt="Dashboard" title='Dashboard' />
                </Link>
                <Link to='/users'>
                    <img src={iconUser} alt="Usuários" title='Usuários' />
                </Link>
                <Link to='/readings'>
                    <img src={iconDocument} alt="Leituras" title='Leituras' />
                </Link>
                <Link to='/'>
                    <img src={iconLogout} alt="Logout" title='Logout' />
                </Link>
            </div>

            <div className="sidemenu__logo">
                <img src={navbarGradient} alt="gradiente" className='logo__gradient' />
                <img src={logo} alt="Logo Cegás" className='logo' />
            </div>
            
            <div className="sidemenu__content">
                <div className="sidemenu__username">
                    <h1>Olá,</h1>
                    <p>{ userLogin.nome ? userLogin.nome.trim().split(" ")[0] : "Usuário"}</p>
                </div>
                <nav className='sidemenu__navbar'>
                    <ul className='navbar__links'>
                        <Link to='/dashboard'>
                            <li className='navbar__link'>Dashboard</li>
                        </Link>

                        <Link to='/users'>
                            <li className='navbar__link'>Usuários</li>
                        </Link>

                        <Link to='/clientes'>
                            <li className='navbar__link'>Clientes</li>
                        </Link>
                        
                        <Link to='/medidores'>
                            <li className='navbar__link'>Medidores</li>
                        </Link>

                        <Link to='/readings'>
                            <li className='navbar__link'>Leituras</li>
                        </Link>
                    </ul>
                </nav>

                <Link to='/'>
                    <div className="sidemenu__exit" onClick={() => logout()}>
                        <img src={btnLogout} alt="Sair" />
                        <h3 className='exit__message'>Sair</h3>
                    </div>
                </Link>
            </div>
        </aside>
    );
}

export default Sidemenu;