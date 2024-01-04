import Sidemenu from '../../Components/Sidemenu';
import './styles.css';

function PageDefault(props) {
    return (
        <div className="dashboard">
            <Sidemenu />
            <main className='main'>
                <div className='main__title'>
                    <h1>{props.title}</h1>
                </div>

                {props.children}
            </main>
        </div>
    );
}

export default PageDefault;