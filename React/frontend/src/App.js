import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AdminContext from './Contexts/AdminContext';
import useAdminProvider from './Hooks/useAdminProvider';
import Dashboard from './Pages/Dashboard';
import Home from './Pages/Home';
import ListUsers from './Pages/ListUsers';
import Readings from './Pages/Readings';
import RecoverPassword from './Pages/RecoverPassword';
import Unauthorized from './Pages/Unauthorized';
import UserProfilePage from './Pages/UserProfile';
import UserVerify from './Pages/UserVerify';
import ListClients from './Pages/ListClients';
import ListGasMeter from './Pages/ListGasMeter';
import ExibirMedidor from './Pages/ExibirMedidor';
import ExibirCliente from './Pages/ExibirCliente';
import ExibirLeitura from './Pages/ExibirLeitura';

function App() {
  const { token, userLogin } = useAdminProvider();

  return (
    <div className="App">
      <BrowserRouter>
        <AdminContext>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/recover_password' element={<RecoverPassword />} />
            <Route path='/verify/:id' element={<UserVerify />} />
            <Route path='/unauthorized' element={<Unauthorized />} />

            {/* Rotas comuns */}
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/readings' element={<Readings />} />
            <Route path='/profile/:id' element={<UserProfilePage />} />
            <Route path='/medidor/detalhes/:id' element={<ExibirMedidor />} />
            <Route path='/cliente/detalhes/:id' element={<ExibirCliente />} />
            <Route path='/readings/detalhes/:id' element={<ExibirLeitura />} />
            <Route path='/users' element={<ListUsers />} />
            <Route path='/clientes' element={<ListClients />} />
            <Route path='/medidores' element={<ListGasMeter />} />

            {/* Rotas exclusivas para admins */}

            {/* Rotas exclusivas para admins e coordenadores */}

          </Routes>
        </AdminContext>
      </BrowserRouter>
    </div>
  );
}

export default App;
