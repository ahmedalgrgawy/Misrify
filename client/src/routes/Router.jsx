import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../Components/Errors/NotFound';
import Login from '../Pages/Login/Login';
import Signup from '../Pages/Signup/Signup';
import Verification from '../Pages/Verification/Verification';
import ForgotPassword from '../Pages/ForgetPassword/ForgetPassword';
import ResetPassword from '../Pages/ResetPassword/ResetPassword';
import CheckGmail from '../Pages/CheckGmail/CheckGmail';
import PasswordSuccess from "../Pages/PasswordSuccess/PasswordSuccess";
import Layout from '../Components/Layout/Layout';
import Contact from '../Components/Contact/Contact';
import AboutUs from '../Pages/ِAboutUs/AboutUs';
import Home from '../Pages/Home/Home';
import Dashboard from '../Components/Dashboard/Dashboard';
import DashboardLayout from '../Components/DashboardLayout/DashboardLayout';
import Users from '../Components/Users/Users';
import Products from '../Components/Products/Products';
import Categories from '../Components/Categories/Categories';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/aboutus", element: <AboutUs /> },
      { path: '/verification', element: <Verification /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/check-gmail', element: <CheckGmail /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/password-success', element: <PasswordSuccess /> },
      { path: '/contact', element: <Contact /> }
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'products', element: <Products /> },
      { path: 'categories', element: <Categories /> },
      // { path: 'support', element: <Support /> },
      // { path: 'settings', element: <Settings /> },
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
