import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import DashNavbar from "../DashNavbar/DashNavbar";

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen">
            <div className="bg-white shadow h-screen">
                <Sidebar />
            </div>
            <div className="flex flex-col flex-1">
                <DashNavbar />
                <main className="flex-1 bg-bg-second p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;