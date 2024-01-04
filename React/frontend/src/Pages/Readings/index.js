import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminProvider from '../../Hooks/useAdminProvider';
import PageDefault from '../../Utils/PageDefault';
import FiltroAvancado from "../../Components/FiltroAvancado";

import iconAdd from '../../Assets/add.svg';
import iconImage from "../../Assets/icon-image.svg";
import iconLupa from '../../Assets/icon-lupa.svg';

import './styles.css';
import CadastrarLeituraModal from './CadastrarLeituraModal';
import Modal from '../../Utils/Modal';

import iconeArquivarVermelho from '../../Assets/icon-archive-red.svg';
import iconeArquivarVerde from '../../Assets/icon-archive-green.svg';
import ExibirImagemLeitura from './ExibirImagemLeitura';

const Readings = () => {
    const navigate = useNavigate();
    const { profileRequest, arquivarLeituraRequest } = useAdminProvider();

    const { loadReadingsRequest } = useAdminProvider();
    const [readings, setReadings] = useState([]);
    const [auxReadings, setAuxReadings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
    const [mostrarMensagemSucesso, setMostrarMensagemSucesso] = useState(false);
    const [mostrarMensagemLeituraArquivada, setMostrarMensagemLeituraArquivada] = useState(false);
    
    const [listarLeiturasArquivadas, setListarLeiturasArquivadas] = useState(false);
    const [leiturasArquivadas, setLeiturasArquivadas] = useState([]);

    const [mensagemleituraArquivada, setMensagemLeituraArquivada] = useState("");

    const [exibirImagemLeitura, setExibirImagemLeitura] = useState(false);
    const [imagemLeitura, setImagemLeitura] = useState('');
    const [idLeitura, setIdLeitura] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await profileRequest();
            if (response.status === 401) {
                navigate('/unauthorized');
            }
        }

        fetchData();

        const fetchReadings = async () => {
            const response = await loadReadingsRequest();
            const naoArquivadas = response.filter(leitura => !leitura.arquivado);

            setReadings(naoArquivadas);
            setAuxReadings(response);
            setIsLoading(false);
        }
        
        setIsLoading(true);
        fetchReadings();
    }, []);

    const handleChange = async (event, categoria) => {
        if (event.target.value.length === 0) {
            setReadings(auxReadings);
        } else {
            if (categoria === "nome_cliente") {
                const fetchData = auxReadings.filter(user =>
                    user.nome_cliente.toLowerCase().includes(event.target.value.toLowerCase().trim()));
                setReadings(fetchData);
            }
        }
    }

    const exibirDetalhesLeitura = (id_leitura) => {
        navigate(`/readings/detalhes/${id_leitura}`);
    }

    const visualizarImagemLeitura = (imagem) => {
        setExibirImagemLeitura(true);
        setImagemLeitura(imagem);
    }

    const arquivarLeitura = async (id) => {
        const response = await arquivarLeituraRequest(id);
        setIdLeitura(id);
        setMensagemLeituraArquivada(response);
        setMostrarMensagemLeituraArquivada(true);
    }

    

    return (
        <div>
            <PageDefault title="Leituras">
                <div className="userList__container">

                    <div className="userList__search">
                        <form onSubmit={e => e.preventDefault(e)}>
                            <input type="text" className='search-user__input' placeholder='Pesquisar por leituras' onChange={(event) => handleChange(event, "nome_cliente")} />
                            <img src={iconLupa} alt="Buscar" />
                        </form>
                    </div>
                    <FiltroAvancado setAux={setAuxReadings} set={setReadings} reading={readings} aux={auxReadings}/>

                    

                    <div className="tableReadings__header">
                        <div className="tableReadings__row">
                            <h3 className="tableReadings__item --larger">Nome do cliente</h3>
                            <h3 className="tableReadings__item --larger">Leiturista</h3>
                            <h3 className="tableReadings__item">LOGIX</h3>
                            <h3 className="tableReadings__item">Leitura</h3>
                            <h3 className="tableReadings__item">Data</h3>
                            <h3 className="tableReadings__item">Status</h3>
                            <h3 className="tableReadings__item --center">Visualizar</h3>
                            {(readings.length>0 && readings[0].arquivado) ?
                                <h3 className="tableReadings__item --center">Desarquivar</h3>
                                :
                                <h3 className="tableReadings__item --center">Arquivar</h3>
                            }
                        </div>
                    </div>
                    <div className="tableReadings__body">

                        {/* {listarLeiturasArquivadas ? 
                        
                            <>

                            {leiturasArquivadas && leiturasArquivadas.length>0 && leiturasArquivadas.map(leitura =>
                                (<ul className="tableReadings__row" key={leitura.id}>
                                    <li className="tableReadings__item --client-name --larger" onClick={() => exibirDetalhesLeitura(leitura.id)}>{leitura.nome_cliente ? leitura.nome_cliente : "Nome do cliente"}</li>
                                    <li className="tableReadings__item --larger">{leitura.nome_leiturista ? leitura.nome_leiturista : "Nome do leiturista"}</li>
                                    <li className="tableReadings__item">{leitura.logix}</li>
                                    <li className="tableReadings__item">{leitura.valor}</li>
                                    <li className="tableReadings__item">{leitura.data}</li>
                                    <li className="tableReadings__item">{leitura.status}</li>
                                    <li className="tableReadings__item --center" onClick={() => visualizarImagemLeitura(leitura.leitura_imagem)}>
                                        <img src={iconImage} alt="Visualizar leitura do cliente" className='--cursor-pointer' />
                                    </li>
                                    
                                </ul>)
                                )
                            }   
                            </>
                            
                            : */}

                            <>

                            {readings && readings.length>0 && readings.map(leitura =>
                                (<ul className="tableReadings__row" key={leitura.id}>
                                    <li className="tableReadings__item --client-name --larger" onClick={() => exibirDetalhesLeitura(leitura.id)}>{leitura.nome_cliente ? leitura.nome_cliente : "Nome do cliente"}</li>
                                    <li className="tableReadings__item --larger">{leitura.nome_leiturista ? leitura.nome_leiturista : "Nome do leiturista"}</li>
                                    <li className="tableReadings__item">{leitura.logix}</li>
                                    <li className="tableReadings__item">{leitura.valor}</li>
                                    <li className="tableReadings__item">{leitura.data}</li>
                                    <li className="tableReadings__item">{leitura.status}</li>
                                    <li className="tableReadings__item --center" onClick={() => visualizarImagemLeitura(leitura.leitura_imagem)}>
                                        <img src={iconImage} alt="Visualizar leitura do cliente" className='--cursor-pointer' />
                                    </li>
                                    {leitura.arquivado?
                                        <li className="tableReadings__item --cursor-pointer --center" onClick={() => arquivarLeitura(leitura.id)}>
                                            <img src={iconeArquivarVerde} alt="Desarquivar leitura" />
                                        </li>
                                        :
                                        <li className="tableReadings__item --cursor-pointer --center" onClick={() => arquivarLeitura(leitura.id)}>
                                            <img src={iconeArquivarVermelho} alt="Arquivar leitura" />
                                        </li>
                                        }
                                </ul>)
                                )
                            }   
                            </>
                        {/* } */}

                        
                    </div>

                    <div className='flex__justify-flex-end --hidden'>
                        <button type="button" className='botao__cadastrar' onClick={() => setMostrarModalCadastro(true)}>
                            <img src={iconAdd} alt="Botão adicionar" />
                            CADASTRAR LEITURA
                        </button>
                    </div>
                </div>
            </PageDefault>

            {/* MODAL */}
            <CadastrarLeituraModal
                isOpen={mostrarModalCadastro}
                onRequestClose={() => setMostrarModalCadastro(false)}
                mostrarMensagemSucesso={() => setMostrarMensagemSucesso(true)}
            />
            {mostrarMensagemSucesso && (
                <Modal
                    title="Leitura cadastrada com sucesso"
                    fecharModalManualmente={() => setMostrarMensagemSucesso(false)}
                />
            )}

            {mostrarMensagemLeituraArquivada && (
                <Modal
                    title={mensagemleituraArquivada}
                    fecharModalManualmente={() => setMostrarMensagemLeituraArquivada(false)}
                    link={`/readings/detalhes/${idLeitura}`}
                />
            )}

            { exibirImagemLeitura && (
                <ExibirImagemLeitura setExibirImagemLeitura={setExibirImagemLeitura} imagem={imagemLeitura} />
            )}
        </div>
    );
}

export default Readings;