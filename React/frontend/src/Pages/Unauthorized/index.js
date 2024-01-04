import Modal from "../../Utils/Modal";
import PageLanding from "../../Utils/PageLanding";

const Unauthorized = () => {
    
    return (
        <PageLanding>
            <div className="unauthorized__container">
                <Modal link="/" title="Você não tem permissão para acessar esta página" unauthorized />
            </div>
        </PageLanding>
    );
}

export default Unauthorized;