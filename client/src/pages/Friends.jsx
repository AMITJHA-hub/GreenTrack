import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, UserMinus, Trophy } from "lucide-react";
import API_BASE_URL from "../api/api.js";

const resolveAvatarUrl = (avatar, username) => {
    if (!avatar) {
        return `https://api.dicebear.com/7.x/initials/svg?seed=${username || 'User'}`;
    }
    return avatar.startsWith("http") ? avatar : `${API_BASE_URL}${avatar}`;
};

function Friends() {
    const [activeTab, setActiveTab] = useState("following");
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const navigate = useNavigate();

    const fetchFriendsData = async () => {
        setIsLoading(true);
        try {
            const [followingRes, followersRes, suggestionsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/users/following`, { credentials: "include" }),
                fetch(`${API_BASE_URL}/users/followers`, { credentials: "include" }),
                fetch(`${API_BASE_URL}/users/suggestions`, { credentials: "include" })
            ]);

            const followingData = await followingRes.json();
            const followersData = await followersRes.json();
            const suggestionsData = await suggestionsRes.json();

            if (followingData.success) setFollowing(followingData.following);
            if (followersData.success) setFollowers(followersData.followers);
            if (suggestionsData.success) setSuggestions(suggestionsData.suggestions);
        } catch (error) {
            console.error("Error fetching friends data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFriendsData();
    }, []);

    const handleFollowToggle = async (targetUserId) => {
        setActionLoadingId(targetUserId);
        try {
            const response = await fetch(`${API_BASE_URL}/users/follow/${targetUserId}`, {
                method: "POST",
                credentials: "include"
            });

            const data = await response.json();
            if (response.ok) {
                await fetchFriendsData();
            } else {
                alert(data.message || "Failed to perform action");
            }
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setActionLoadingId(null);
        }
    };

    const currentData = activeTab === "following" ? following : followers;

    return (
        <main className="min-h-[calc(100vh-5rem)] bg-transparent px-4 py-10 sm:px-6 md:px-10 md:py-16">
            <section className="mx-auto max-w-6xl">
                {}
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                        MY SOCIAL CIRCLE
                    </h1>
                    <p className="mt-3 text-base font-medium text-slate-500 sm:text-lg md:text-xl">
                        Connect with fellow Guardians and track your collective impact.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
                    
                    {}
                    <div>
                        {}
                        <div className="flex w-full flex-col rounded-2xl bg-slate-100 p-1 sm:flex-row">
                            <button
                                onClick={() => setActiveTab("following")}
                                className={
                                    activeTab === "following"
                                        ? "w-full rounded-xl bg-white px-6 py-4 text-sm font-bold tracking-wider text-emerald-600 shadow-sm"
                                        : "w-full rounded-xl px-6 py-4 text-sm font-bold tracking-wider text-slate-500"
                                }
                            >
                                FOLLOWING ({following.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("followers")}
                                className={
                                    activeTab === "followers"
                                        ? "w-full rounded-xl bg-white px-6 py-4 text-sm font-bold tracking-wider text-emerald-600 shadow-sm"
                                        : "w-full rounded-xl px-6 py-4 text-sm font-bold tracking-wider text-slate-500"
                                }
                            >
                                FOLLOWERS ({followers.length})
                            </button>
                        </div>

                        {}
                        <div className="mt-8">
                            {isLoading ? (
                                <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
                                    <p className="font-bold text-slate-500 animate-pulse">Loading connections...</p>
                                </div>
                            ) : currentData.length === 0 ? (
                                <div className="flex min-h-[350px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-12">
                                    <div className="flex max-w-md flex-col items-center text-center">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                                            <Users size={36} />
                                        </div>
                                        <h2 className="mt-6 text-xl font-black text-slate-950">
                                            {activeTab === "following"
                                                ? "YOU FOLLOW NO ONE YET!"
                                                : "NO FOLLOWERS YET!"}
                                        </h2>
                                        <p className="mt-3 text-sm leading-6 text-slate-500">
                                            {activeTab === "following"
                                                ? "Explore follow suggestions on the right or checkout community rankings."
                                                : "Keep planting and sharing to grow your audience."}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {currentData.map((person) => (
                                        <div
                                            key={person._id}
                                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={resolveAvatarUrl(person.avatar, person.username)}
                                                    alt={person.username}
                                                    className="h-12 w-12 rounded-full object-cover border border-slate-100 shadow-sm"
                                                />
                                                <div>
                                                    <h3 className="font-bold text-slate-950">
                                                        {person.username}
                                                    </h3>
                                                    <p className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                                                        <Trophy size={12} className="text-amber-500" />
                                                        {person.globalPoints} Points
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {}
                                            {activeTab === "following" ? (
                                                <button
                                                    disabled={actionLoadingId === person._id}
                                                    onClick={() => handleFollowToggle(person._id)}
                                                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <UserMinus size={14} />
                                                    Unfollow
                                                </button>
                                            ) : (
                                                following.some(f => f._id === person._id) ? (
                                                    <span className="text-xs font-bold text-slate-400 px-4 py-2">
                                                        Following
                                                    </span>
                                                ) : (
                                                    <button
                                                        disabled={actionLoadingId === person._id}
                                                        onClick={() => handleFollowToggle(person._id)}
                                                        className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                                                    >
                                                        <UserPlus size={14} />
                                                        Follow Back
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
                        <h2 className="text-lg font-black text-slate-950 flex items-center gap-2">
                            <Users size={20} className="text-emerald-500" />
                            SUGGESTED GUARDIANS
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Discover active members in the GreenTrack community.
                        </p>

                        <div className="mt-6 space-y-4">
                            {isLoading ? (
                                <p className="text-xs text-slate-400 animate-pulse">Loading suggestions...</p>
                            ) : suggestions.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No new suggestions found.</p>
                            ) : (
                                suggestions.map((person) => (
                                    <div
                                        key={person._id}
                                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                                    >
                                        <div className="flex items-center gap-2.5">
                                                <img
                                                    src={resolveAvatarUrl(person.avatar, person.username)}
                                                    alt={person.username}
                                                    className="h-9 w-9 rounded-full object-cover border border-slate-100 shadow-sm"
                                                />
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-950">
                                                    {person.username}
                                                </h4>
                                                <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                                                    <Trophy size={10} className="text-amber-500" />
                                                    {person.globalPoints} pts
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            disabled={actionLoadingId === person._id}
                                            onClick={() => handleFollowToggle(person._id)}
                                            className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                                        >
                                            Follow
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}

export default Friends;