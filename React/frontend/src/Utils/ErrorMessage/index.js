import './styles.css';

function ErrorMessage(props) {
    return (
        <div className='error__field'>
            <span className={`error__message ${props.login && '--login'}`}>{props.message}</span>
        </div>
    );
}

export default ErrorMessage;