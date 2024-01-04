import { useState } from "react";
import './styles.css';
import calendar from '../../Assets/Calendar.svg';
import { format, isAfter, isBefore, isEqual, isSameWeek, isSameMonth, isSameDay, isDate } from 'date-fns';
import ptBRLocale from 'date-fns/locale/pt-BR';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import iconeArquivarVermelho from '../../Assets/icon-archive-red.svg';
import iconeArquivarVerde from '../../Assets/icon-archive-green.svg';
import { ar } from "date-fns/locale";

const FiltroAvancado = (props) => {

    const [dataInicial, setDataInicial] = useState(null);
    const [auxDataInicial, setAuxDataInicial] = useState(null);
    const [dataFinal, setDataFinal] = useState(null);
    const [auxDataFinal, setAuxDataFinal] = useState(null);
    const [periodo, setPeriodo] = useState("Selecione uma opção");
    const [status, setStatus] = useState("Selecione uma opção");
    const [cliente, setCliente] = useState("");
    const [leiturista, setLeiturista] = useState("");
    const [arquivado, setArquivado] = useState(false);


    const [open, setOpen] = useState(false);
    const [openStatus, setOpenStatus] = useState(false);

    const formatData = (DataDDMMYY) => {
        const dataSplit = DataDDMMYY.split("/");
        const novaData = new Date(parseInt(dataSplit[2], 10),
            parseInt(dataSplit[1], 10) - 1,
            parseInt(dataSplit[0], 10));
        return novaData;
    }

    const handleChange = (value, categoria) => {
        const fetchData = props.aux.filter(user => {
            return  verificarData(user.data,value, categoria) &&
                    verificarStatus(user.status, value, categoria) &&
                    verificarCliente(user.nome_cliente,value,categoria) &&
                    verificarLeiturista(user.nome_leiturista,value,categoria) &&
                    verificarArquivado(user.arquivado,value,categoria);
        });
        props.set(fetchData);
    }

    const verificarArquivado = (userValue,event,categoria) => {
        const verificando = categoria === "arquivado"? event : arquivado;
        return userValue === verificando;
    }

    const verificarCliente = (userValue, event, categoria) => {
        const value = categoria === "nomeCliente"? event : cliente;
        if(value === "")
            return true;
        else
            return userValue.toLowerCase().includes(value.toLowerCase().trim());
    }
    const verificarLeiturista = (userValue, event, categoria) => {
        const value = categoria === "nomeLeiturista"? event : leiturista;
        if( value === "")
            return true;
        else
            return userValue.toLowerCase().includes(value.toLowerCase().trim());
    }

    const verificarIntervalo = (userData, event, categoria) => {
        const inicio = categoria === "dataInicial"? event : dataInicial;
        const final = categoria === "dataFinal"? event : dataFinal;

        if ( inicio == null && final == null)
            return true;
        
        const before = inicio != null && inicio.length > 9? isBefore(formatData(inicio), formatData(userData)) : false;
        const equalI = inicio != null && inicio.length > 9? isEqual(formatData(inicio), formatData(userData)): false;
        const equalF = final != null? isEqual(formatData(final), formatData(userData)): false;
        const equal = equalF || equalI;
        const after = final != null? isAfter(formatData(final), formatData(userData)) : false;

        return inicio != null ? final != null? ((before && after) || equal) : (before || equal) : (after || equal) ;
    }

    const verificarData = (userValue,event, categoria) => {
        const value = categoria === "dropDownData"? event : periodo;
        if(value === "Dia" || value === "Semana" || value === "Mês" || value === "Selecione uma opção"){
            setDataFinal(null); setDataInicial(null);
            setAuxDataFinal(null); setAuxDataInicial(null);
        }
        else
            return verificarIntervalo(userValue, event, categoria);

        const hoje = new Date();
        const date = formatData(`${hoje.getDate()}/${hoje.getMonth()+1}/${hoje.getFullYear()}`);
        if(value === "Dia")
            return isSameDay(date,formatData(userValue));
        if(value === "Semana")
            return isSameWeek(date,formatData(userValue));
        if(value === "Mês")
            return isSameMonth(date, formatData(userValue));

        return true;
    }

    const verificarStatus = (userValue, event, categoria) => {
        const value = categoria === "dropDownStatus"? event : status;
        if( value === "Selecione uma opção")
            return true;
        else
            return userValue.toLowerCase().includes(value.toLowerCase().trim());

    }
  
    function DropdownPeriodo() {
        return (
            <div className="menu_container">
                <div className="menu_trigger" onClick={() => { setOpen(!open) }}>
                    {periodo}
                </div>

                <div className={`dropdown_menu ${open ? 'active' : 'inactive'}`}>
                    <ul>
                        <DropdownItem texto="Selecione uma opção" set={setPeriodo} categoria={"dropDownData"} drop={open} setDrop={setOpen}/>
                        <DropdownItem texto="Dia" set={setPeriodo} categoria={"dropDownData"} drop={open} setDrop={setOpen}/>
                        <DropdownItem texto="Semana" set={setPeriodo} categoria={"dropDownData"} drop={open} setDrop={setOpen}/>
                        <DropdownItem texto="Mês" set={setPeriodo} categoria={"dropDownData"} drop={open} setDrop={setOpen}/>
                        <DropdownItem texto="Intervalo" set={setPeriodo} drop={open} setDrop={setOpen}/>

                    </ul>
                </div>
            </div>
        );
    }

    function DropdownStatus() {
        return (
            <div className="menu_container">
                <div className="menu_trigger" onClick={() => { setOpenStatus(!openStatus) }}>
                    {status}
                </div>

                <div className={`dropdown_menu ${openStatus ? 'active' : 'inactive'}`}>
                    <ul>
                        <DropdownItem texto={"Selecione uma opção"} set={setStatus} categoria={"dropDownStatus"} drop={openStatus} setDrop={setOpenStatus}/>
                        <DropdownItem texto={"Sincronizada"} set={setStatus} categoria={"dropDownStatus"} drop={openStatus} setDrop={setOpenStatus}/>
                        <DropdownItem texto={"Suspeita de erro"} set={setStatus} categoria={"dropDownStatus"} drop={openStatus} setDrop={setOpenStatus}/>
                    </ul>
                </div>
            </div>
        );
    }

    function DropdownItem(props) {
        return (
            <li className='dropdownItem' onClick={() => {
                    
                props.set(props.texto);
                props.setDrop(!props.drop)
                handleChange(props.texto,props.categoria);
                
            }}>
                <span> {props.texto} </span>
            </li>
        );
    }

    return (
        <div>
            <div className="filtro__container" >
                <div className="Filtros_title">
                    <h2>Filtros</h2>
                </div>

                <section className="column__input">
                    <label>Período</label>
                    <DropdownPeriodo />
                </section> 

                {periodo === "Intervalo" &&
                    <div className="datePicker">
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                        <DatePicker
                            views={['day', 'month', 'year']}
                            label="Data inicial"
                            value={auxDataInicial}
                            onChange={(newValue) => {
                                setAuxDataInicial(newValue)
                                if(newValue != null && newValue != "Invalid Date" && (parseInt(format(newValue,"yyyy"))>1900)){
                                    setDataInicial(format(newValue,"dd/MM/yyyy"));
                                    handleChange(format(newValue,"dd/MM/yyyy"),"dataInicial")
                                }else {
                                    setDataInicial(null);
                                    handleChange(null,"dataInicial")
                                }
                                
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        
                    </LocalizationProvider>
                </div>
                }

                {periodo === "Intervalo" &&
                    <div className="datePicker">
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBRLocale}>
                        <DatePicker
                            views={['day', 'month', 'year']}
                            label="Data final"
                            value={auxDataFinal}
                            onChange={(newValue) => {
                                setAuxDataFinal(newValue)
                                if(newValue != null && newValue != "Invalid Date" && parseInt(format(newValue,"yyyy"))>1900){
                                        setDataFinal(format(newValue,"dd/MM/yyyy"));
                                        handleChange(format(newValue,"dd/MM/yyyy"),"dataFinal")
                                } else {
                                setDataFinal(null);
                                handleChange(null,"dataFinal")
                                }
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    </div>
                }

                <section className="column__input">
                    <label> Leiturista </label>
                    <input placeholder="nome do leiturista"
                        onChange={(event) => {
                            setLeiturista(event.target.value)
                            handleChange(event.target.value, "nomeLeiturista");
                        }}
                    />
                </section>

                <section className="column__input">
                    <label> Cliente </label>
                    <input placeholder="nome do cliente"
                        onChange={(event) => {
                            setCliente(event.target.value)
                            handleChange(event.target.value, "nomeCliente");
                        }}
                    />
                </section>

                <section className="column__input">
                    <label>Status</label>
                        <DropdownStatus />
                </section>

            </div>
            { !arquivado ? 
                    <>
                        <div className="userList__archiveButton userList__top-button">
                            <button className='archiveButton' onClick={() => {
                                handleChange(!arquivado,"arquivado");
                                setArquivado(!arquivado);
                                }}>
                                <span>Leituras arquivadas</span>
                                <img src={iconeArquivarVermelho} alt="Leituras arquivadas" />
                            </button>
                        </div>
                    </>
                    :
                    <>
                        <div className="userList__unarchiveButton userList__top-button">
                            <button className='unarchiveButton' onClick={() => {
                                handleChange(!arquivado,"arquivado");
                                setArquivado(!arquivado);
                                }}>
                                <span>Voltar</span>
                            </button>
                        </div>
                    </>
                }
        </div>
    );
}

export default FiltroAvancado;