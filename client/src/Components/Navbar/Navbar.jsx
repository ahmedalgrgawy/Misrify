import { memo, useState } from "react";
import { FaBars, FaRegUserCircle } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { PiSignOutBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/authSlice";
import { Tooltip } from "react-tooltip";

// eslint-disable-next-line react/display-name
const Navbar = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const handleToggle = () => setMenuOpen(!isMenuOpen);
  const handleClose = () => setMenuOpen(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const menuItems =
    isAuthenticated && user.role !== "user"
      ? [
          { name: "Home", path: "/" },
          { name: "About", path: "/aboutus" },
        { name: "Dashboard", path: "/analytics" },
          { name: "Contact Us", path: "/contact" },
        ]
      : [
          { name: "Home", path: "/" },
          { name: "About", path: "/aboutus" },
          { name: "Contact Us", path: "/contact" },
          { name: "Students", path: "/students" },
        ];

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      {isMenuOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-dark-blue bg-opacity-50 z-40 md:hidden"
        />
      )}
      <nav className="h-16 flex justify-between items-center px-5 lg:px-10">
        <NavLink
          to="/"
          className="font-jaro text-4xl tracking-wider font-bold text-title-blue uppercase"
        >
          {/* <img src={logo} className="h-6 inline-block" alt="Logo" /> */}
          Misrify
        </NavLink>

        {/* Mobile */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-bg-main z-50 transition-transform duration-300 ease-in-out transform
                 md:hidden ${
                   isMenuOpen ? "translate-x-0" : "translate-x-full"
                 }`}
        >
          <ul className="flex flex-col p-4 space-y-4">
            {menuItems.map((item, index) => (
              <li key={index} className="uppercase font-semibold text-lg">
                <NavLink
                  to={item.path}
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive
                      ? "text-dark-grey"
                      : "text-main-blue hover:text-dark-blue font-semibold uppercase relative after:content-['']: after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-dark-blue after:transition-all after:duration-300 after:scale-x-0 hover:after:scale-x-100"
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <div
            className="absolute top-4 right-4 cursor-pointer"
            onClick={handleClose}
          >
            <AiOutlineClose className="text-title-blue text-2xl" />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-x-6">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-dark-grey font-semibold uppercase"
                  : "text-main-blue hover:text-dark-blue font-semibold uppercase relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-dark-blue after:transition-all after:duration-300 after:scale-x-0 hover:after:scale-x-100"
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-x-6">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/notifications"
                className="hover:opacity-80 transition-opacity duration-500"
                data-tooltip-id="Notifications"
                data-tooltip-place="bottom"
                data-tooltip-content="Notifications"
              >
                <IoNotifications className="text-main-blue text-xl cursor-pointer" />
              </NavLink>
              <NavLink
                to="/profile"
                className="hover:opacity-80 transition-opacity duration-500"
                data-tooltip-id="Profile"
                data-tooltip-place="bottom"
                data-tooltip-content="Profile"
              >
                <FaRegUserCircle className="text-main-blue text-xl cursor-pointer" />
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 transition-opacity duration-500"
                data-tooltip-id="Logout"
                data-tooltip-place="bottom"
                data-tooltip-content="Logout"
              >
                <PiSignOutBold className="text-xl" />
              </button>
            </>
          ) : (
            <div className="flex gap-x-4">
              <NavLink
                to="/signup"
                className="font-inter bg-main-blue hover:bg-white border-transparent hover:border-main-blue border-2 text-white hover:text-title-blue transition duration-400 ease-in py-2 px-7 rounded-xl
                             font-semibold sm:px-2 sm:py-1 sm:text-sm sm:font-medium"
              >
                Sign Up
              </NavLink>
              <NavLink
                to="/login"
                className="font-inter bg-transparent text-main-blue hover:bg-main-blue border-2 border-title-blue hover:text-white transition duration-400 ease-in py-2 px-7 
                             rounded-xl font-semibold sm:px-2 sm:py-1 sm:text-sm sm:font-medium"
              >
                Login
              </NavLink>
            </div>
          )}
          <div
            onClick={handleToggle}
            className="cursor-pointer text-main-blue text-xl md:hidden"
          >
            <FaBars />
          </div>
        </div>
      </nav>
      <Tooltip
        id="Profile"
        className="!py-1 !px-2 !bg-title-blue !rounded-md"
      />
      <Tooltip id="Logout" className="!py-1 !px-2 !bg-red-600 !rounded-md" />
      <Tooltip
        id="Notifications"
        className="!py-1 !px-2 !bg-title-blue !rounded-md"
      />
    </div>
  );
});

export default Navbar;
