import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API_BASE_URL from "../api/api.js";
import {
    Trees,
    LayoutDashboard,
    Globe2,
    Users,
    UserRound,
    Sprout,
    Trophy,
    Menu,
    X,
} from "lucide-react";

const resolveAvatarUrl = (avatar, username) => {
    if (!avatar) {
        return `https://api.dicebear.com/7.x/initials/svg?seed=${username || 'User'}`;
    }
    return avatar.startsWith("http") ? avatar : `${API_BASE_URL}${avatar}`;
};

function Navbar() {
    const { user, authLoading } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const linkStyle = ({ isActive }) =>
        isActive
            ? "flex items-center gap-3 rounded-2xl border border-emerald-250 bg-emerald-50 px-4.5 py-2.5 font-bold text-green-700 text-base"
            : "flex items-center gap-3 px-3 py-2.5 text-base font-bold text-slate-600 hover:text-emerald-600 transition";
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white">

            <div className="flex h-24 items-center justify-between px-4 sm:px-6 lg:px-10">

                {}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white sm:h-14 sm:w-14">
                        <Trees size={26} />
                    </div>

                    <span className="text-2xl font-black text-emerald-700 sm:text-3xl">
                        GreenTrack
                    </span>
                </div>

                {}
                <div className="hidden items-center gap-4 lg:flex">
                    <NavLink to="/dashboard" className={linkStyle}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>

                    <NavLink to="/feed" className={linkStyle}>
                        <Globe2 size={20} />
                        Feed
                    </NavLink>

                    <NavLink to="/community" className={linkStyle}>
                        <Users size={20} />
                        Community
                    </NavLink>

                    <NavLink to="/friends" className={linkStyle}>
                        <UserRound size={20} />
                        Friends
                    </NavLink>

                    <NavLink to="/mytrees" className={linkStyle}>
                        <Sprout size={20} />
                        My Trees
                    </NavLink>

                    <NavLink to="/rankings" className={linkStyle}>
                        <Trophy size={20} />
                        Rankings
                    </NavLink>
                </div>

                {}
                <div className="hidden items-center gap-5 lg:flex text-base">
                    <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4.5 py-2 rounded-full">
                        🏆 {user?.globalPoints ?? 0} Points
                    </span>

                    <Link to="/profile" className="flex items-center gap-3.5 text-lg font-black text-slate-800 hover:text-emerald-600 transition">
                        <img 
                            src={resolveAvatarUrl(user?.avatar, user?.username)} 
                            alt={user?.username} 
                            className="h-14 w-14 rounded-full object-cover border-2 border-emerald-300 shadow shadow-emerald-100 transition hover:scale-105" 
                        />

                        <span className="truncate max-w-[150px]">
                            {authLoading
                                ? "Loading..."
                                : user?.username || "Profile"}
                        </span>
                    </Link>
                </div>

                {}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="rounded-lg p-2 text-gray-700 lg:hidden"
                >
                    {menuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>

            </div>

            {}
            {menuOpen && (
                <div className="absolute left-0 top-full z-50 w-full border-b bg-white p-4 shadow-lg lg:hidden">

                    <div className="flex flex-col gap-3">

                        <NavLink
                            to="/dashboard"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/feed"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Globe2 size={18} />
                            Feed
                        </NavLink>

                        <NavLink
                            to="/community"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Users size={18} />
                            Community
                        </NavLink>

                        <NavLink
                            to="/friends"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <UserRound size={18} />
                            Friends
                        </NavLink>

                        <NavLink
                            to="/mytrees"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Sprout size={18} />
                            My Trees
                        </NavLink>

                        <NavLink
                            to="/rankings"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Trophy size={18} />
                            Rankings
                        </NavLink>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                                Points: {user?.globalPoints ?? 0}
                            </span>

                            <Link 
                                to="/profile" 
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2 font-semibold text-gray-700 text-xs hover:text-emerald-600 transition"
                            >
                                <img 
                                    src={resolveAvatarUrl(user?.avatar, user?.username)} 
                                    alt={user?.username} 
                                    className="h-5 w-5 rounded-full object-cover border border-slate-200" 
                                />
                                <span>
                                    {authLoading
                                        ? "Loading..."
                                        : user?.username || "Profile"}
                                </span>
                            </Link>
                        </div>

                    </div>

                </div>
            )}

        </nav>
    );
}

export default Navbar;