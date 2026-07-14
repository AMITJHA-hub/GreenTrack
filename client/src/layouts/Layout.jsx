import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Layout() {
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center font-black text-emerald-600 animate-pulse text-lg tracking-wider">
                    Securing Connection...
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-slate-50">
            <AnimatedBackground />

            <Navbar />

            <div className="relative z-10 pt-24">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;