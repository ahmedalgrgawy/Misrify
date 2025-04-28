import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import DashNavbar from "../DashNavbar/DashNavbar";

const DashboardLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="bg-white shadow h-full">
                <Sidebar />
            </div>
            <div className="flex flex-col flex-1 h-full overflow-hidden shadow-lg">
                <DashNavbar />
                <main className="flex-1 overflow-auto bg-bg-second p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;