import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaUsers, FaHeadset, FaClipboardList, FaCog, FaPowerOff, FaRegUserCircle, FaBox, FaPaperPlane } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { logoutUser } from "../../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaBagShopping } from "react-icons/fa6";

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userRole = useSelector((state) => state.auth.user?.role);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
    };
    return (
        <div className="h-screen w-60 bg-white shadow-md flex flex-col justify-between py-6 px-4">
            <div>
                <NavLink
                    to="/"
                    style={{ fontFamily: "Jaro" }}
                    className="block text-4xl font-medium tracking-wide text-center text-title-blue mb-8"
                >
                    MISRIFY
                </NavLink>
                <nav className="space-y-2">
                    <NavLink
                        to="/analytics"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition ${isActive
                                ? "bg-title-blue text-white"
                                : "text-title-blue hover:bg-bg-second"
                            }`
                        }
                    >
                        <FaTachometerAlt className="text-xl" />
                        <span className="text-sm font-medium">Analytics</span>
                    </NavLink>

                    <NavLink
                        to="products"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition ${isActive
                                ? "bg-title-blue text-white"
                                : "text-title-blue hover:bg-bg-second"
                            }`
                        }
                    >
                        <FaBoxOpen className="text-xl" />
                        <span className="text-sm font-medium">Products</span>
                    </NavLink>

                    <NavLink
                        to="requested-products"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition ${isActive
                                ? "bg-title-blue text-white"
                                : "text-title-blue hover:bg-bg-second"
                            }`
                        }
                    >
                        <FaBox className="text-xl" />
                        <span className="text-sm font-medium">Requested Products</span>
                    </NavLink>

                    {userRole === "admin" && (
                        <>
                            <NavLink
                                to="categories"
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition ${isActive
                                        ? "bg-title-blue text-white"
                                        : "text-title-blue hover:bg-bg-second"
                                    }`
                                }
                            >
                                <FaClipboardList className="text-xl" />
                                <span className="text-sm font-medium">Categories & Brands</span>
                            </NavLink>

                            <NavLink
                                to="users"
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition ${isActive
                                        ? "bg-title-blue text-white"
                                        : "text-title-blue hover:bg-bg-second"
                                    }`
                                }
                            >
                                <FaUsers className="text-xl" />
                                <span className="text-sm font-medium">Users</span>
                            </NavLink>

                            <NavLink
                                to="merchants"
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition ${isActive
                                        ? "bg-title-blue text-white"
                                        : "text-title-blue hover:bg-bg-second"
                                    }`
                                }
                            >
                                <FaUsers className="text-xl" />
                                <span className="text-sm font-medium">Merchants</span>
                            </NavLink>
                        </>
                    )}

                    {userRole === "admin" && (
                        <NavLink
                            to="messages"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition ${isActive
                                    ? "bg-title-blue text-white"
                                    : "text-title-blue hover:bg-bg-second"
                                }`
                            }
                        >
                            <FaHeadset className="text-xl" />
                            <span className="text-sm font-medium">Contact Messages</span>
                        </NavLink>
                    )}

                    {userRole === "merchant" && (
                        <>
                            <NavLink
                                to="orders"
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition ${isActive
                                        ? "bg-title-blue text-white"
                                        : "text-title-blue hover:bg-bg-second"
                                    }`
                                }
                            >
                                <FaBagShopping className="text-xl" />
                                <span className="text-sm font-medium">Orders</span>
                            </NavLink>
                            <NavLink
                                to="reviews"
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition ${isActive
                                        ? "bg-title-blue text-white"
                                        : "text-title-blue hover:bg-bg-second"
                                    }`
                                }
                            >
                                <FaPaperPlane className="text-xl" />
                                <span className="text-sm font-medium">Reviews & Comments</span>
                            </NavLink>
                            <NavLink
                                to="support"
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition ${isActive
                                        ? "bg-title-blue text-white"
                                        : "text-title-blue hover:bg-bg-second"
                                    }`
                                }
                            >
                                <FaHeadset className="text-xl" />
                                <span className="text-sm font-medium">Help & Support</span>
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>

            <div className="space-y-2 border-t border-light-grey pt-4">
                <div className="collapse collapse-arrow bg-base-100">
                    <input type="checkbox" id="settings-collapse" className="peer" />
                    <label
                        htmlFor="settings-collapse"
                        className="collapse-title text-title-blue font-medium flex items-center gap-3 cursor-pointer"
                    >
                        <FaCog className="text-xl" />
                        Settings
                    </label>
                    <div className="collapse-content text-sm flex flex-col gap-2">
                        <NavLink
                            to={"/profile"}
                            className="flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition text-title-blue hover:bg-bg-second"
                        >
                            <FaRegUserCircle className="text-lg" />
                            <span className="text-sm font-medium"> Update Profile</span>
                        </NavLink>
                        <NavLink
                            to={"/notifications"}
                            className="flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition text-title-blue hover:bg-bg-second"
                        >
                            <IoNotifications className="text-lg" />
                            <span className="text-sm font-medium"> Notifications</span>
                        </NavLink>
                        <NavLink
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition text-title-blue hover:bg-bg-second"
                        >
                            <FaPowerOff className="text-lg" />
                            <span className="text-sm font-medium">Logout</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
