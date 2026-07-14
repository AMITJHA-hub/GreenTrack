import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import API_BASE_URL from "../api/api.js";
import {
    Sprout,
    Shield,
    Trophy,
    Users,
    Calendar,
    Leaf,
    Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CropModal from "../components/CropModal.jsx";

const resolveAvatarUrl = (avatar, username) => {
    if (!avatar) {
        return `https://api.dicebear.com/7.x/initials/svg?seed=${username || 'User'}`;
    }
    return avatar.startsWith("http") ? avatar : `${API_BASE_URL}${avatar}`;
};

function Profile() {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const [trees, setTrees] = useState([]);
    const [loadingTrees, setLoadingTrees] = useState(true);
    const avatarInputRef = useRef(null);
    const [cropImageUrl, setCropImageUrl] = useState("");
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCropImageUrl(URL.createObjectURL(file));
        setIsCropModalOpen(true);
    };

    const uploadCroppedAvatar = async (croppedBlob) => {
        const formData = new FormData();
        formData.append("avatar", croppedBlob, "avatar.jpg");

        try {
            const response = await fetch(`${API_BASE_URL}/users/update-avatar`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                setIsCropModalOpen(false);
            } else {
                alert(data.message || "Failed to update profile picture.");
            }
        } catch (error) {
            console.error("Error updating avatar:", error);
            alert("An error occurred during upload.");
        }
    };

    useEffect(() => {
        async function fetchUserTrees() {
            try {
                const response = await fetch(`${API_BASE_URL}/trees/getusertrees`, {
                    credentials: "include"
                });
                const data = await response.json();
                if (data.success) {
                    setTrees(data.data || []);
                }
            } catch (error) {
                console.error("Error fetching user trees:", error);
            } finally {
                setLoadingTrees(false);
            }
        }
        if (user) {
            fetchUserTrees();
        }
    }, [user]);

    // Calculate level based on global points
    const points = user?.globalPoints || 0;
    const currentLevel = Math.floor(points / 100) + 1;
    const pointsInLevel = points % 100;

    return (
        <main className="min-h-[calc(100vh-5rem)] bg-transparent px-4 py-8 sm:px-6 md:px-8">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Hero Profile Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    {/* Cover Photo Banner */}
                    <div className="h-48 bg-gradient-to-r from-emerald-500 to-teal-600" />
                    
                    <div className="px-6 pb-8 sm:px-8">
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {/* Interactive Avatar */}
                        <div 
                            onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
                            className="group relative -mt-28 flex h-44 w-44 cursor-pointer items-center justify-center overflow-hidden rounded-[2.75rem] border-4 border-white bg-slate-950 text-4xl text-white shadow-2xl transition-transform hover:scale-105"
                        >
                            <img 
                                src={resolveAvatarUrl(user?.avatar, user?.username)} 
                                alt={user?.username} 
                                className="h-full w-full object-cover" 
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-black tracking-widest uppercase text-white">Change</span>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <h1 className="text-3xl font-black text-slate-950">
                                    {user?.username || "Earth Guardian"}
                                </h1>
                                <p className="text-sm font-semibold text-slate-400 mt-1">
                                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "2026"}
                                </p>
                                <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                    <Shield size={14} className="text-emerald-600" />
                                    Level {currentLevel} Guardian
                                </div>
                            </div>

                            {/* Main CTA */}
                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={() => navigate("/feed")}
                                    className="rounded-2xl bg-emerald-500 px-6 py-3.5 text-xs font-black tracking-wider text-white hover:bg-emerald-600 transition shadow-lg shadow-emerald-100"
                                >
                                    SHARE UPDATE
                                </button>
                                <button
                                    onClick={logout}
                                    className="rounded-2xl bg-red-50 border border-red-100 hover:bg-red-100/50 hover:border-red-200 px-6 py-3.5 text-xs font-black tracking-wider text-red-600 transition shadow-sm"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Layout for Stats and Level Progress */}
                <div className="grid gap-6 md:grid-cols-3">
                    
                    {/* XP Progress Card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black tracking-wider text-slate-400">
                                LEVEL PROGRESSION
                            </h3>
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                {pointsInLevel} / 100 XP
                            </span>
                        </div>
                        
                        <div className="mt-6">
                            {/* Bar container */}
                            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div 
                                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                    style={{ width: `${pointsInLevel}%` }}
                                />
                            </div>
                            <p className="mt-3 text-xs font-semibold text-slate-400">
                                Earn {100 - pointsInLevel} more points to reach Level {currentLevel + 1}!
                            </p>
                        </div>
                    </div>

                    {/* Community Affiliation */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Users size={16} className="text-slate-400" />
                                <span className="text-xs font-black tracking-wider">LOCAL CHAPTER</span>
                            </div>
                            <h2 className="mt-4 text-xl font-black text-slate-900 truncate">
                                {user?.community?.name || "Local Chapter"}
                            </h2>
                        </div>
                        <button
                            onClick={() => navigate("/community")}
                            className="mt-6 w-full text-center text-xs font-black text-emerald-600 hover:text-emerald-700 transition"
                        >
                            View Chapter Members &rarr;
                        </button>
                    </div>

                </div>

                {/* General Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-3">
                    
                    {/* Stat Card: Global Points */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black tracking-wider text-slate-400">GLOBAL POINTS</p>
                            <p className="text-2xl font-black text-slate-900 mt-1">{user?.globalPoints || 0}</p>
                        </div>
                    </div>

                    {/* Stat Card: Trees Planted */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                            <Sprout size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black tracking-wider text-slate-400">TREES PLANTED</p>
                            <p className="text-2xl font-black text-slate-900 mt-1">{trees.length}</p>
                        </div>
                    </div>

                    {/* Stat Card: Local Points */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black tracking-wider text-slate-400">LOCAL POINTS</p>
                            <p className="text-2xl font-black text-slate-900 mt-1">{user?.localPoints || 0}</p>
                        </div>
                    </div>

                </div>

                {/* Planted Trees Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Leaf size={20} className="text-emerald-500" />
                        <h2 className="text-xl font-black text-slate-900">
                            My Planted Trees
                        </h2>
                    </div>

                    {loadingTrees ? (
                        <div className="text-center py-10 font-bold text-slate-500 animate-pulse bg-white rounded-3xl border border-slate-200">
                            Loading your trees...
                        </div>
                    ) : trees.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-3xl border border-slate-200">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                <Sprout size={32} />
                            </div>
                            <h3 className="mt-6 text-lg font-black text-slate-900">No Trees Rooted Yet</h3>
                            <p className="mt-2 max-w-sm text-sm text-slate-400 font-semibold">
                                You haven't registered any trees. Head over to the My Trees page to plant and log your first tree!
                            </p>
                            <button
                                onClick={() => navigate("/mytrees")}
                                className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-black text-white hover:bg-slate-800 transition"
                            >
                                Register a Tree
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {trees.map((tree) => (
                                <div 
                                    key={tree._id} 
                                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col"
                                >
                                    {/* Image Wrapper */}
                                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                                        <img 
                                            src={`${API_BASE_URL}${tree.photoUrl}`} 
                                            alt={tree.treeType} 
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400";
                                            }}
                                        />
                                        <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                                            tree.healthstatus === "Alive" 
                                                ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                                                : tree.healthstatus === "Sick"
                                                ? "bg-amber-50 border-amber-100 text-amber-600"
                                                : "bg-rose-50 border-rose-100 text-rose-600"
                                        }`}>
                                            {tree.healthstatus}
                                        </span>
                                    </div>

                                    {/* Card Details */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-base font-black text-slate-900 capitalize">
                                                {tree.treeType}
                                            </h3>
                                            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-400">
                                                <Calendar size={14} />
                                                <span>Planted {new Date(tree.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            {isCropModalOpen && (
                <CropModal
                    imageUrl={cropImageUrl}
                    onClose={() => {
                        setIsCropModalOpen(false);
                        if (cropImageUrl) URL.revokeObjectURL(cropImageUrl);
                    }}
                    onSave={uploadCroppedAvatar}
                />
            )}
            </div>
        </main>
    );
}

export default Profile;
