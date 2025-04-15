import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer.jsx";

const Layout = () => {
    return (
        <>
            <Navbar />
            <div className="pt-14">
                <Outlet></Outlet>
            </div>
            <Footer/>
        </>
    );
};

export default Layout;
