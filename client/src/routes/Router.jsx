import { createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/Home/Home';
import NotFound from '../Components/Errors/NotFound';
import Login from '../Pages/Login/Login';
import Signup from '../Pages/Signup/Signup';


const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Home />,
            index: true
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
            path: '*',
            element: <NotFound />
        }

    ]
);

export default router;