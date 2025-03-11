import { useState } from 'react';
import { FaShoppingCart, FaBars, FaRegUserCircle } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import { PiSignOutBold } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/logo.png';
import { logout } from '../../features/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated } = useSelector(state => state.auth);

    const handleToggle = () => setMenuOpen(!isMenuOpen);
    const handleClose = () => setMenuOpen(false);

    const handleLogout = () => {
        dispatch(logout());
    };

    const menuItems = isAuthenticated
        ? [
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Analytics', path: '/analytics' }
        ]
        : [
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Contact Us', path: '/contact' }
        ];

    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
            <nav className="h-16 flex justify-between items-center px-5 py-4">
                <NavLink to="/" className="text-2xl font-bold text-title-blue">
                    <img src={logo} className="h-6" alt="Logo" />
                </NavLink>

                <div className={`fixed top-0 right-0 h-full bg-bg-main p-16 duration-700 ease-in-out ${isMenuOpen ? 'top-0' : '-top-full'} md:static md:flex md:p-0 md:bg-transparent`}>
                    <ul className="flex flex-col md:flex-row md:gap-x-6 text-center bg-transparent">
                        {menuItems.map((item, index) => (
                            <li key={index} className="uppercase font-semibold text-[17px] py-2">
                                <NavLink to={item.path} className={({ isActive }) =>
                                    isActive
                                        ? "text-dark-grey"
                                        : "text-main-blue hover:text-dark-blue transition-colors duration-500 relative after:block after:content-[''] after:border-b-2 after:border-dark-blue after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"}>
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <div className="absolute top-5 right-6 cursor-pointer text-main-blue text-2xl md:hidden" onClick={handleClose}>
                        <AiOutlineClose />
                    </div>
                </div>

                <div className="flex items-center gap-x-6">
                    {isAuthenticated ? (
                        <>
                            <NavLink to="/cart" className="transition-opacity duration-500 opacity-100 hover:opacity-80">
                                <FaShoppingCart className="text-main-blue text-[22px] cursor-pointer" />
                            </NavLink>
                            <NavLink to="/profile" className="transition-opacity duration-500 opacity-100 hover:opacity-80">
                                <FaRegUserCircle className="text-main-blue text-[22px] cursor-pointer" />
                            </NavLink>
                            <button onClick={handleLogout} className="text-red-600 hover:text-red-800 transition-opacity duration-500 opacity-100">
                                <PiSignOutBold className="text-[22px]" />
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-x-4 transition-opacity duration-500 opacity-100">
                            <NavLink to="/signup" className="bg-main-blue text-white px-4 py-1 rounded-xl hover:bg-dark-blue transition duration-400 ease-in">
                                Sign Up
                            </NavLink>
                            <NavLink to="/login" className="border-2 border-main-blue text-main-blue px-4 py-1 rounded-xl font-semibold bg-bg-white hover:bg-main-blue hover:text-white transition duration-400 ease-in">
                                Login
                            </NavLink>
                        </div>
                    )}
                    <div onClick={handleToggle} className="cursor-pointer text-main-blue text-[22px] md:hidden">
                        <FaBars />
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
