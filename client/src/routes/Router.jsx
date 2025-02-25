import { createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/Home/Home';
import NotFound from '../Components/Errors/NotFound';
import Login from '../Pages/Login/Login';
import Signup from '../Pages/Signup/Signup';
import Verification from '../Pages/Verification/Verification';
import ForgotPassword from '../Pages/ForgetPassword/ForgetPassword';
import ResetPassword from '../Pages/ResetPassword/ResetPassword';

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Home />,
            index: true
        },
        {
            path: "/verification",
            element: <Verification />,
        },
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/signup',
            element: <Signup />,
        },
        {
            path: '/forgot-password',
            element: <ForgotPassword />,
        },
        {
            path: '/reset-password',
            element: <ResetPassword />
        },
        {
            path: '*',
            element: <NotFound />
        }

    ]
);

export default router;