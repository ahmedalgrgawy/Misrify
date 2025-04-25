import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaUsers, FaHeadset, FaClipboardList, FaCog, FaPowerOff } from "react-icons/fa";
import { logoutUser } from "../../features/authSlice";
import { useDispatch } from "react-redux";

const Sidebar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };
    return (
        <div className="h-screen w-60 bg-white shadow-md flex flex-col justify-between py-6 px-4">
            <div>

                <NavLink to="/" style={{ fontFamily: 'Jaro' }}
                    className="block text-3xl font-medium tracking-wide text-center text-title-blue mb-8"
                >
                    MISRIFY
                </NavLink>
                <nav className="space-y-2">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition 
                        ${isActive ? "bg-title-blue text-white" : "text-title-blue hover:bg-bg-second"}`}
                    >
                        <FaTachometerAlt className="text-xl" />
                        <span className="text-sm font-medium">Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="products"
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition 
                        ${isActive ? "bg-title-blue text-white" : "text-title-blue hover:bg-bg-second"}`
                        }
                    >
                        <FaBoxOpen className="text-xl" />
                        <span className="text-sm font-medium">Products</span>
                    </NavLink>
                    <NavLink
                        to="users"
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition 
                        ${isActive ? "bg-title-blue text-white" : "text-title-blue hover:bg-bg-second"}`
                        }
                    >
                        <FaUsers className="text-xl" />
                        <span className="text-sm font-medium">Users</span>
                    </NavLink>
                    <NavLink
                        to="support"
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition 
                        ${isActive ? "bg-title-blue text-white" : "text-title-blue hover:bg-bg-second"}`
                        }
                    >
                        <FaHeadset className="text-xl" />
                        <span className="text-sm font-medium">Support</span>
                    </NavLink>
                    <NavLink
                        to="categories"
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition
                         ${isActive ? "bg-title-blue text-white" : "text-title-blue hover:bg-bg-second"}`
                        }
                    >
                        <FaClipboardList className="text-xl" />
                        <span className="text-sm font-medium">Categories</span>
                    </NavLink>
                </nav>
            </div>

            <div className="space-y-2 border-t border-light-grey pt-4">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition
                     ${isActive ? "bg-title-blue text-white" : "text-title-blue hover:bg-bg-second"}`
                    }
                >
                    <FaCog className="text-xl" />
                    <span className="text-sm font-medium">Settings</span>
                </NavLink>
                <NavLink
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition text-title-blue hover:bg-bg-second"
                >
                    <FaPowerOff className="text-xl" />
                    <span className="text-sm font-medium">Logout</span>
                </NavLink>

            </div>
        </div>
    );
};

export default Sidebar;
