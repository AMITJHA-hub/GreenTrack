import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
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

function Navbar() {
    const { user, authLoading } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const linkStyle = ({ isActive }) =>
        isActive
            ? "flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 font-semibold text-green-700"
            : "flex items-center gap-2 font-medium text-gray-600";

    return (
        <nav className="sticky top-0 z-50 border-b bg-white">

            <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-10">

                {/* Logo */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white sm:h-12 sm:w-12">
                        <Trees size={22} />
                    </div>

                    <span className="text-xl font-bold text-emerald-700 sm:text-2xl">
                        GreenTrack
                    </span>
                </div>

                {/* Desktop Navigation */}
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

                {/* Desktop Profile */}
                <div className="hidden items-center gap-4 lg:flex">
                    <span className="text-sm font-medium text-gray-700">
                        Points: {user?.points ?? 0}
                    </span>

                    <div className="flex items-center gap-2 font-medium text-gray-700">
                        <UserRound size={20} />

                        <span>
                            {authLoading
                                ? "Loading..."
                                : user?.username || "Profile"}
                        </span>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="rounded-lg p-2 text-gray-700 lg:hidden"
                >
                    {menuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>

            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="absolute left-0 top-full z-50 w-full border-b bg-white p-4 shadow-lg lg:hidden">

                    <div className="flex flex-col gap-3">

                        <NavLink
                            to="/dashboard"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <LayoutDashboard size={20} />
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/feed"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Globe2 size={20} />
                            Feed
                        </NavLink>

                        <NavLink
                            to="/community"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Users size={20} />
                            Community
                        </NavLink>

                        <NavLink
                            to="/friends"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <UserRound size={20} />
                            Friends
                        </NavLink>

                        <NavLink
                            to="/mytrees"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Sprout size={20} />
                            My Trees
                        </NavLink>

                        <NavLink
                            to="/rankings"
                            className={linkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Trophy size={20} />
                            Rankings
                        </NavLink>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">
                                Points: {user?.points ?? 0}
                            </span>

                            <div className="flex items-center gap-2 font-medium text-gray-700">
                                <UserRound size={20} />

                                <span>
                                    {authLoading
                                        ? "Loading..."
                                        : user?.name || "Profile"}
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
            )}

        </nav>
    );
}

export default Navbar;