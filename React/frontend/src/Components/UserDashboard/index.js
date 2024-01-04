import DashboardPanel from "../../Utils/DashboardPanel";
import iconDocument from "../../Assets/icon-document-green.svg";
import "./styles.css";
import ModalExtract from "./ModalExtract";
import useAdminProvider from "../../Hooks/useAdminProvider";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
    const { loadDashboardRequest, dashboard } = useAdminProvider();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadDashboardRequest();
    }, []);

    return (
        <>
            {isOpen && <ModalExtract setIsOpen={setIsOpen} />}
            <div className="dashboard__container">
                <div className="dashboard__button">
                    <div className="button__sync" onClick={() => setIsOpen(true)}>
                        <h2 className="sync__title">Extrato de sincronização</h2>
                        <img src={iconDocument} alt="Extrato de sincronização" className="sync__icon" />
                    </div>
                </div>
                <div className="dashboard__title">
                    <h3>Leituras aguardando processamento</h3>
                </div>
                <div className="dashboard__panels">
                    <DashboardPanel title="Pendentes de sincronização" value={dashboard.leituras_pendentes_sincronizacao} />
                </div>
                <div className="dashboard__title">
                    <h3>Leituras pendentes de análise</h3>
                </div>
                <div className="dashboard__panels">
                    <DashboardPanel title="Não sincronizadas" value={dashboard.leituras_nao_sincronizadas} />
                    <DashboardPanel title="Suspeita de erro de leitura" value={dashboard.leituras_suspeitas_erro} error />
                    <DashboardPanel title="Erro de sincronização" value={dashboard.leituras_erro_sincronizacao} error />
                </div>
                <div className="dashboard__button">
                    <Link to={'/readings'}>
                        <button className="button__medition">Ver todas as medições</button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default UserDashboard;