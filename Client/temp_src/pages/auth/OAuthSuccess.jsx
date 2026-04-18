import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../COmponent/layouts/DashboardLayout.jsx';
import DashboardSkeleton from '../home/DashboardSkeleton';

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateUser } = useContext(UserContext);

    useEffect(() => {
        // Parse token from URL query params
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            // Because our updateUser function expects an object with {token}, we pass it that.
            // When the Dashboard loads, the context useEffect will fetch the real profile.
            updateUser({ token });
            localStorage.setItem('token', token);
            
            // Redirect to dashboard explicitly using window.location.href to force context reload
            setTimeout(() => {
                 window.location.href = '/dashboard';
            }, 500);
        } else {
            console.error("No token found in OAuth callback URL.");
            navigate('/', { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DashboardLayout>
             <DashboardSkeleton />
        </DashboardLayout>
    );
};

export default OAuthSuccess;
