import './styles.css';

const DashboardPanel = (props) => {
    return (
        <div className={`panel__container ${props.error && '.panel__error'}`}>
            <div className="panel__title">
                {props.title}
            </div>
            <div className="panel__info">
                {props.value}
            </div>
        </div>
    );
}

export default DashboardPanel;