import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDashboard from '../../Components/UserDashboard';
import useAdminProvider from '../../Hooks/useAdminProvider';
import PageDefault from '../../Utils/PageDefault';

const Dashboard = () => {
    const navigate = useNavigate();
    const { profileRequest } = useAdminProvider();

    useEffect(() => {
        const fetchData = async () => {
            const response = await profileRequest();
            if(response.status === 401) {
                navigate('/unauthorized');
            }
        }

        fetchData();
    }, []);

    return (
        <PageDefault title="Dashboard">
            <UserDashboard />
        </PageDefault>
    );
}

export default Dashboard;