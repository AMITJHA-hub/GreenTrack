import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import AnimatedBackground from "../components/AnimatedBackground.jsx";

function Layout() {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-slate-50">
            <AnimatedBackground />

            <Navbar />

            <div className="relative z-10">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;