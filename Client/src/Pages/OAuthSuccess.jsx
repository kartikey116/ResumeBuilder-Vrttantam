import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/userContext';

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
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-t-blue-500 border-b-purple-500 rounded-full animate-spin mx-auto"></div>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Authenticating...
                </h2>
                <p className="text-gray-400">Please wait while we log you in implicitly.</p>
            </div>
        </div>
    );
};

export default OAuthSuccess;
