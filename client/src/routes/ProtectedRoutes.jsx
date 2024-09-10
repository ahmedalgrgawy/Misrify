import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {

    const userToken = localStorage.getItem('accessToken')

    const location = useLocation();

    return userToken ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoute;