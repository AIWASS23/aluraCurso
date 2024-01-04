import './styles.css';
import LoginGradients from '../../Components/LoginGradients';
import LogoWhite from '../../Components/LogoWhite';
import { Link } from 'react-router-dom';

function PageLanding(props) {
    return (
        <div className="home__page">
            <LoginGradients />
            <Link to='/'>
                <LogoWhite />
            </Link>

            {props.children}
        </div>
    );
}

export default PageLanding;