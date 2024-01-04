import { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';
import { useTheme } from '@mui/material/styles';
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

export default function DropdownSelecionarMedidorCliente({ setMedidorSelecionado, idCliente }) {
  const { listarMedidoresClienteRequest } = useAdminProvider();
  const [medidores, setMedidores] = useState([]);
  const theme = useTheme();
  
  const handleChange = (event) => {
    setMedidorSelecionado(event.target.value);
  };

  useEffect(() => {

    async function fetch() {
        const response = await listarMedidoresClienteRequest(idCliente);
        setMedidores(response);
    }

    fetch();

  }, [idCliente]);

  return (
    <div>
        <Select
            onChange={(e) => handleChange(e)}
            input={<Input style={getInputStyle(theme)} />}
            MenuProps={MenuProps}
            >
            <MenuItem value="">
                <em>Selecione um medidor</em>
            </MenuItem>
            {medidores.length>0 && medidores.map(medidor => 
                <MenuItem style={getStyles(theme)} value={medidor.id}>{medidor.numero_serie}</MenuItem>
            )}
        </Select>
    </div>
  );
}