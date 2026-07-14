import { Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import API_BASE_URL from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const resolveAvatarUrl = (avatar, username) => {
    if (!avatar) {
        return `https://api.dicebear.com/7.x/initials/svg?seed=${username || 'User'}`;
    }
    return avatar.startsWith("http") ? avatar : `${API_BASE_URL}${avatar}`;
};

function Rankings() {
    const [activeTab, setActiveTab] = useState("planters");
    const [planters, setPlanters] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [localPlanters, setLocalPlanters] = useState([]);
    const { user, setUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboardData() {
            try {
                
                const plantersRes = await fetch(`${API_BASE_URL}/leaderboards/global-planters`);
                const plantersData = await plantersRes.json();
                if (plantersData.success) {
                    setPlanters(plantersData.data);
                }

                
                const commRes = await fetch(`${API_BASE_URL}/leaderboards/top-communities`);
                const commData = await commRes.json();
                if (commData.success) {
                    setCommunities(commData.data);
                }

                
                const userRes = await fetch(`${API_BASE_URL}/users/me`, {
                    credentials: "include"
                });
                const userData = await userRes.json();
                if (userData.success) {
                    setUser(userData.user);
                    const communityId = userData.user.community?._id || userData.user.community;
                    if (communityId) {
                        const localRes = await fetch(`${API_BASE_URL}/leaderboards/local-communities/${communityId}`);
                        const localData = await localRes.json();
                        if (localData.success) {
                            setLocalPlanters(localData.data);
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading leaderboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLeaderboardData();
    }, []);

    const currentData = 
        activeTab === "planters" 
            ? planters 
            : activeTab === "local" 
            ? localPlanters 
            : communities;

    const topThree = currentData.slice(0, 3);
    const rest = currentData.slice(3);

    return (
        <main className="min-h-[calc(100vh-5rem)] bg-transparent px-4 py-10 sm:px-6 md:px-8 md:py-16">
            <section className="mx-auto flex max-w-5xl flex-col items-center text-center">

                {}
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-250 bg-emerald-50 px-4 py-2 shadow-sm">
                    <Trophy size={16} className="text-emerald-600 animate-pulse" />
                    <span className="text-xs font-black tracking-[0.2em] text-emerald-700">
                        GLOBAL STANDINGS
                    </span>
                </div>

                {}
                <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                    Leaderboard
                </h1>

                <p className="mt-3 text-base font-medium text-slate-500 sm:text-lg">
                    Competing to restore the planet&apos;s lungs.
                </p>

                {}
                <div className="mt-10 flex w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-slate-100 p-1 sm:mt-12 sm:flex-row">
                    <button
                        onClick={() => setActiveTab("planters")}
                        className={
                            activeTab === "planters"
                                ? "w-full rounded-xl border border-emerald-200 bg-white px-4 py-3.5 text-xs font-black tracking-wider text-emerald-600 shadow-sm transition sm:px-6"
                                : "w-full rounded-xl px-4 py-3.5 text-xs font-black tracking-wider text-slate-400 hover:text-slate-600 transition sm:px-6"
                        }
                    >
                        TOP PLANTERS
                    </button>

                    {(user?.community?._id || user?.community) && (
                        <button
                            onClick={() => setActiveTab("local")}
                            className={
                                activeTab === "local"
                                    ? "w-full rounded-xl border border-emerald-200 bg-white px-4 py-3.5 text-xs font-black tracking-wider text-emerald-600 shadow-sm transition sm:px-6"
                                    : "w-full rounded-xl px-4 py-3.5 text-xs font-black tracking-wider text-slate-400 hover:text-slate-600 transition sm:px-6"
                            }
                        >
                            MY COMMUNITY
                        </button>
                    )}

                    <button
                        onClick={() => setActiveTab("communities")}
                        className={
                            activeTab === "communities"
                                ? "w-full rounded-xl border border-emerald-200 bg-white px-4 py-3.5 text-xs font-black tracking-wider text-emerald-600 shadow-sm transition sm:px-6"
                                : "w-full rounded-xl px-4 py-3.5 text-xs font-black tracking-wider text-slate-400 hover:text-slate-600 transition sm:px-6"
                        }
                    >
                        TOP COMMUNITIES
                    </button>
                </div>

                {}
                {!isLoading && currentData.length > 0 && (
                    <div className="mb-6 mt-16 flex items-end justify-center gap-2 sm:gap-6 w-full max-w-2xl">
                        
                        {}
                        {topThree[1] && (
                            <div className="flex flex-col items-center flex-1">
                                <div className="relative mb-3">
                                    <div className="flex h-16 w-16 overflow-hidden items-center justify-center rounded-full border-4 border-slate-300 bg-white font-black text-slate-700 shadow-md">
                                        {activeTab === "communities" ? "👥" : (
                                            <img 
                                                src={resolveAvatarUrl(topThree[1].avatar, topThree[1].username)} 
                                                alt={topThree[1].username} 
                                                className="h-full w-full object-cover" 
                                            />
                                        )}
                                    </div>
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-slate-200 px-2.5 py-0.5 text-[9px] font-black text-slate-800 shadow">
                                        🥈 2nd
                                    </span>
                                </div>
                                <p className="max-w-[100px] truncate text-xs font-black text-slate-800">
                                    {activeTab === "communities" ? topThree[1].name : topThree[1].username}
                                </p>
                                <p className="text-[10px] font-black text-emerald-600 mb-2">
                                    {(activeTab === "communities" ? topThree[1].totalPoints : (activeTab === "planters" ? topThree[1].globalPoints : topThree[1].localPoints)) || 0} pts
                                </p>
                                {}
                                <div className="w-24 h-16 bg-slate-50 border-t border-slate-200 rounded-t-xl flex items-center justify-center shadow-inner">
                                    <span className="text-xl font-bold text-slate-300">2</span>
                                </div>
                            </div>
                        )}

                        {}
                        {topThree[0] && (
                            <div className="flex flex-col items-center flex-1">
                                <div className="relative mb-4 scale-110">
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-2xl animate-bounce">👑</span>
                                    <div className="flex h-20 w-20 overflow-hidden items-center justify-center rounded-full border-4 border-amber-400 bg-white font-black text-amber-600 shadow-lg">
                                        {activeTab === "communities" ? "👥" : (
                                            <img 
                                                src={resolveAvatarUrl(topThree[0].avatar, topThree[0].username)} 
                                                alt={topThree[0].username} 
                                                className="h-full w-full object-cover" 
                                            />
                                        )}
                                    </div>
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-2.5 py-0.5 text-[9px] font-black text-amber-950 shadow">
                                        🥇 1st
                                    </span>
                                </div>
                                <p className="max-w-[120px] truncate text-sm font-black text-slate-900">
                                    {activeTab === "communities" ? topThree[0].name : topThree[0].username}
                                </p>
                                <p className="text-xs font-black text-emerald-600 mb-2">
                                    {(activeTab === "communities" ? topThree[0].totalPoints : (activeTab === "planters" ? topThree[0].globalPoints : topThree[0].localPoints)) || 0} pts
                                </p>
                                {}
                                <div className="w-28 h-24 bg-emerald-50 border-t-2 border-emerald-300 rounded-t-2xl flex items-center justify-center shadow-inner">
                                    <span className="text-3xl font-extrabold text-emerald-500">1</span>
                                </div>
                            </div>
                        )}

                        {}
                        {topThree[2] && (
                            <div className="flex flex-col items-center flex-1">
                                <div className="relative mb-3">
                                    <div className="flex h-14 w-14 overflow-hidden items-center justify-center rounded-full border-4 border-amber-600 bg-white font-black text-amber-900 shadow-md">
                                        {activeTab === "communities" ? "👥" : (
                                            <img 
                                                src={resolveAvatarUrl(topThree[2].avatar, topThree[2].username)} 
                                                alt={topThree[2].username} 
                                                className="h-full w-full object-cover" 
                                            />
                                        )}
                                    </div>
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-600 px-2.5 py-0.5 text-[9px] font-black text-white shadow">
                                        🥉 3rd
                                    </span>
                                </div>
                                <p className="max-w-[100px] truncate text-xs font-black text-slate-800">
                                    {activeTab === "communities" ? topThree[2].name : topThree[2].username}
                                </p>
                                <p className="text-[10px] font-black text-emerald-600 mb-2">
                                    {(activeTab === "communities" ? topThree[2].totalPoints : (activeTab === "planters" ? topThree[2].globalPoints : topThree[2].localPoints)) || 0} pts
                                </p>
                                {}
                                <div className="w-24 h-12 bg-amber-50/10 border-t border-amber-200 rounded-t-xl flex items-center justify-center shadow-inner">
                                    <span className="text-lg font-bold text-amber-700">3</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {}
                <div className="mt-4 w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm">
                    {isLoading ? (
                        <div className="text-center py-10 font-bold text-slate-500 animate-pulse">Loading standings...</div>
                    ) : currentData.length === 0 ? (
                        <div className="text-center py-10 font-bold text-slate-400">No records found.</div>
                    ) : (
                        <div className="space-y-1">
                            {}
                            {rest.length === 0 ? (
                                <div className="text-center py-6 text-sm font-bold text-slate-400">
                                    All standings displayed on the podium.
                                </div>
                            ) : (
                                rest.map((item, index) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between px-4 py-4 text-left transition hover:bg-slate-50 rounded-2xl"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 font-black text-slate-500 text-xs shrink-0">
                                                #{index + 4}
                                            </span>

                                            <div className="flex items-center gap-3">
                                                {activeTab !== "communities" && (
                                                    <div className="h-9 w-9 overflow-hidden bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                                        <img 
                                                            src={resolveAvatarUrl(item.avatar, item.username)} 
                                                            alt={item.username} 
                                                            className="h-full w-full object-cover" 
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                                                        {activeTab === "communities" ? item.name : item.username}
                                                    </h2>
                                                    <p className="text-[11px] font-bold text-slate-400">
                                                        {activeTab === "communities"
                                                            ? "Local Community Chapter"
                                                            : activeTab === "local"
                                                            ? `${user?.community?.name || "Local"} Member`
                                                            : "Global Earth Guardian"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <span className="text-xs sm:text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                            {(activeTab === "communities" ? item.totalPoints : (activeTab === "planters" ? item.globalPoints : item.localPoints)) || 0} pts
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

            </section>
        </main>
    );
}

export default Rankings;
