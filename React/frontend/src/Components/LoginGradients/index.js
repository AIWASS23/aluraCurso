import './styles.css';
import gradientUpperLeft from '../../Assets/login-vector-upper-left.svg';
import gradientUpperRight from '../../Assets/login-vector-upper-right.svg';
import gradientDownRight from '../../Assets/login-vector-down-right.svg';

function LoginGradients() {
    return (
        <>
            <img src={gradientUpperLeft} className="gradient__left --upper" />
            <img src={gradientUpperRight} className="gradient__right --upper" />
            <img src={gradientDownRight} className="gradient__right --down" />
        </>
    )
}

export default LoginGradients;