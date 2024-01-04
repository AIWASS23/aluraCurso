import { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';
import { useTheme } from '@mui/material/styles';
import clientesService from '../../Services/clientes.service';
import useAdminProvider from '../../Hooks/useAdminProvider';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getInputStyle(theme) {
    return {
        fontSize: '1.4rem',
        width: '38rem'
    }
}

function getStyles(theme) {
    return {
        fontSize: '1.4rem'
    };
}

export default function BotaoSelecionarCliente({ setClienteSelecionado, setMedidoresCliente }) {
  const { listarClientesDropdownRequest, listarMedidoresClienteRequest } = useAdminProvider();
  const [clientes, setClientes] = useState([]);
  const theme = useTheme();
  
  const handleChange = async (event) => {
    setClienteSelecionado(event.target.value); 
    const medidores = await obterMedidoresCliente(event.target.value);
    setMedidoresCliente(medidores);
  };

  const obterMedidoresCliente = async (idCliente) => {
    const response = await listarMedidoresClienteRequest(idCliente);
    return response;
  }

  useEffect(() => {

    async function fetch() {
        const response = await listarClientesDropdownRequest();
        setClientes(response);
    }

    fetch();

  }, []);

  return (
    <div>
        <Select
            onChange={(e) => handleChange(e)}
            input={<Input style={getInputStyle(theme)} />}
            MenuProps={MenuProps}
            >
            <MenuItem value="">
                <em>Selecione um cliente</em>
            </MenuItem>
            {clientes && clientes.map(cliente => 
                <MenuItem style={getStyles(theme)} value={cliente.id}>{cliente.nome}</MenuItem>
            )}
        </Select>
    </div>
  );
}