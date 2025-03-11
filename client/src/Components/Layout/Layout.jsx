import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
const Layout = () => {
    return (
        <>
            <Navbar />
            <div className="pt-14">
                <Outlet></Outlet>
            </div>
        </>
    );
};

export default Layout;
