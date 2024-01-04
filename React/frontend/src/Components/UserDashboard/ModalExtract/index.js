import btnClose from '../../../Assets/btn-close-green.svg';
import ptBRLocale from 'date-fns/locale/pt-BR';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import "./styles.css";
import { useEffect, useState } from 'react';
import useAdminProvider from '../../../Hooks/useAdminProvider';
import { isAfter, isBefore, isEqual, parse } from 'date-fns';

const ModalExtract = ({ setIsOpen }) => {
    const { exibirExtratoLeiturasRequest } = useAdminProvider();

    const [valueInitial, setValueInitial] = useState(null);
    const [valueFinal, setValueFinal] = useState(null);

    const [extratoInicial, setExtratoInicial] = useState([]);
    const [extrato, setExtrato] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const response = await exibirExtratoLeiturasRequest();
            const datas = [];
            let index = 1;
            Object.entries(response).map(([key, value]) => { datas.push({ id: index++, data: key, quantidade_leituras: value.length }) });
            setExtratoInicial(datas);
            setExtrato(datas);
        }

        fetch();
    }, []);

    useEffect(() => {
        const extratoClone = [...extratoInicial];

        if (valueInitial !== null || valueFinal !== null) {
            const novaListaExtrato = extratoClone.filter(ext => {
                let dataExtratoEvalida = false;
                const dataExtrato = parse(ext.data, "dd/MM/yyyy", new Date());

                if (valueInitial !== null) {
                    dataExtratoEvalida = isAfter(dataExtrato, valueInitial) || isEqual(dataExtrato, valueInitial);
                }

                if (valueFinal !== null) {
                    dataExtratoEvalida = isBefore(dataExtrato, valueFinal) || isEqual(dataExtrato, valueFinal);
                }

                return dataExtratoEvalida;
            });
            setExtrato(novaListaExtrato)
        }
    }, [valueInitial, valueFinal]);
        
    return (
        <div className="extract__background">
            <div className="extract__container">
                <div className="extract__close-button" onClick={() => setIsOpen(false)}>
                    <img src={btnClose} alt="Fechar modal" />
                </div>
                <div className="extract__title">
                    <h2>Extrato de Sincronização</h2>
                </div>
                <div className="extract__dates">
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                        <DatePicker
                            views={['day', 'month', 'year']}
                            label="Data inicial"
                            value={valueInitial}
                            onChange={(newValue) => {
                                setValueInitial(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                            views={['day', 'month', 'year']}
                            label="Data final"
                            value={valueFinal}
                            onChange={(newValue) => {
                                setValueFinal(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
                <div className="extract__list">
                    { extrato.length > 0 && extrato.map(item => 
                        <div className="extract__list-item" key={item.id}>
                            <h3>{item.quantidade_leituras} {item.quantidade_leituras === 1 ? "leitura registrada" : "leituras registradas"}</h3>
                            <span>{item.data}</span>
                        </div>
                    ) }
                </div>
            </div>
        </div>
    );
}

export default ModalExtract;