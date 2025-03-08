import { createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/Home/Home';
import NotFound from '../Components/Errors/NotFound';
import Login from '../Pages/Login/Login';
import Signup from '../Pages/Signup/Signup';
import Verification from '../Pages/Verification/Verification';
import ForgotPassword from '../Pages/ForgetPassword/ForgetPassword';
import ResetPassword from '../Pages/ResetPassword/ResetPassword';
import CheckGmail from '../Pages/CheckGmail/CheckGmail';
import PasswordSuccess from '../Pages/PasswordSuccess/PasswordSuccess';

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
            path: '/check-gmail',
            element: <CheckGmail />,
        },
        {
            path: '/reset-password',
            element: <ResetPassword/>
        },
        {
            path: '/password-success',
            element: <PasswordSuccess />
        },
        {
            path: '*',
            element: <NotFound />
        }

    ]
);

export default router;