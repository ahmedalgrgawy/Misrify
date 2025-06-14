import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer.jsx";
import { useEffect } from "react";

const Layout = () => {


        const { pathname } = useLocation();

        useEffect(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, [pathname]);

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
