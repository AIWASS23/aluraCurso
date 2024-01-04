import btnFecharModal from '../../../Assets/btn-close-green.svg';
import useAdminProvider from '../../../Hooks/useAdminProvider';
import './styles.css';

const ExibirImagemLeitura = ({ imagem, setExibirImagemLeitura }) => {

    const { url_server_imagem } = useAdminProvider();
    const caminhoImagem = `${url_server_imagem}leitura/${imagem}`;

    const handleFecharModal = () => {
        setExibirImagemLeitura(false);
    }

    return (
        <div className="imagem-leitura__container">
            <div className="imagem-leitura__modal">
                <button onClick={() => handleFecharModal()} className="imagem-leitura__btn-fechar">
                    <img src={btnFecharModal} alt="Fechar modal" />
                </button>
                <figure className='imagem-leitura__imagem'>
                    <img src={caminhoImagem} alt="Leitura" />
                </figure>
            </div>
        </div>
    );
}

export default ExibirImagemLeitura;