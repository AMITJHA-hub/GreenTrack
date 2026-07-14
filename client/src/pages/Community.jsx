import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Trees,
    Users,
    MapPin,
    Plus,
    X,
    Send,
} from "lucide-react";
import API_BASE_URL from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Community() {
    const { setUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateText, setUpdateText] = useState("");
    const [hasCommunity, setHasCommunity] = useState(false);
    const [community, setCommunity] = useState(null);
    const [feed, setFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const fetchCommunityData = async () => {
        setIsLoading(true);
        try {
            const communityRes = await fetch(`${API_BASE_URL}/communities/me`, {
                credentials: "include",
            });
            const communityData = await communityRes.json();

            if (communityData.success && communityData.hasCommunity) {
                setHasCommunity(true);
                setCommunity(communityData.community);

                // Fetch community feed
                const feedRes = await fetch(`${API_BASE_URL}/posts/getcommunityfeed`, {
                    credentials: "include",
                });
                const feedData = await feedRes.json();
                if (feedData.success) {
                    setFeed(feedData.feed);
                }
            } else {
                setHasCommunity(false);
            }
        } catch (error) {
            console.error("Error fetching community data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCommunityData();
    }, []);

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setUpdateText("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!updateText.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/posts/createpost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: updateText }),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                closeModal();
                // Refresh community data
                await fetchCommunityData();
                
                // Refresh user points
                const meRes = await fetch(`${API_BASE_URL}/users/me`, { credentials: "include" });
                const meData = await meRes.json();
                if (meData.success) {
                    setUser(meData.user);
                }
            } else {
                alert(data.message || "Failed to post update");
            }
        } catch (error) {
            alert("Error publishing update: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-[calc(100vh-5rem)] bg-transparent px-4 py-8 sm:px-6 md:px-10 lg:px-16 lg:py-12">
            <section className="mx-auto max-w-6xl">
                {isLoading ? (
                    <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
                        <p className="font-bold text-slate-500 animate-pulse">Loading your green community...</p>
                    </div>
                ) : !hasCommunity ? (
                    /* No Community Empty State */
                    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm sm:px-10 sm:py-14 lg:rounded-[3rem] lg:py-16">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 sm:h-24 sm:w-24">
                            <MapPin size={42} />
                        </div>
                        <h1 className="mt-8 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                            NO LOCAL HUB YET
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-7 text-slate-500 sm:text-lg sm:leading-8">
                            You are not assigned to a local community yet. Once you plant your first tree,
                            the system automatically detects your local boundary and links you to your regional hub!
                        </p>
                        <button
                            onClick={() => navigate("/mytrees")}
                            className="mt-8 w-full rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-bold tracking-[0.18em] text-white shadow-xl shadow-emerald-200 transition hover:bg-emerald-600 sm:w-auto sm:px-12"
                        >
                            PLANT A TREE
                        </button>
                    </div>
                ) : (
                    /* Community View */
                    <>
                        {/* Community Hero */}
                        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm sm:px-10 sm:py-14 lg:rounded-[3rem] lg:py-16">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-200 sm:h-24 sm:w-24">
                                <Trees size={42} />
                            </div>
                            <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl uppercase">
                                {community?.name} COMMUNITY
                            </h1>

                            {/* Community Info */}
                            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
                                    <Users size={16} className="text-emerald-600" />
                                    <span className="text-xs font-bold tracking-wider text-emerald-700">
                                        {community?.memberCount} ACTIVE GUARDIANS
                                    </span>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
                                    <Trees size={16} className="text-emerald-600" />
                                    <span className="text-xs font-bold tracking-wider text-emerald-700">
                                        {community?.treeCount} TREES PLANTED
                                    </span>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span className="text-xs font-bold tracking-wider text-slate-400">
                                        POINTS: {community?.totalPoints}
                                    </span>
                                </div>
                            </div>

                            <p className="mx-auto mt-8 max-w-2xl text-base font-medium leading-7 text-slate-500 sm:text-lg sm:leading-8">
                                Welcome to the {community?.name} hub. Connect, share,
                                and grow while restoring the Earth&apos;s balance together.
                            </p>
                        </div>

                        {/* Updates Header */}
                        <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-xs font-black tracking-[0.3em] text-slate-400 sm:text-sm">
                                COMMUNITY UPDATES
                            </h2>
                            <button
                                onClick={openModal}
                                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-7 py-4 text-sm font-bold tracking-wider text-white shadow-lg transition hover:bg-slate-800 sm:w-auto"
                            >
                                <Plus size={19} />
                                SHARE UPDATE
                            </button>
                        </div>

                        {/* Feed Contents */}
                        {feed.length === 0 ? (
                            <div className="mt-8 flex min-h-[450px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-12 sm:min-h-[520px] lg:rounded-[3rem]">
                                <div className="flex max-w-xl flex-col items-center text-center">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-50 text-slate-200">
                                        <MapPin size={48} />
                                    </div>
                                    <h2 className="mt-8 text-2xl font-black text-slate-950 sm:text-3xl">
                                        QUIET IN THE NEIGHBORHOOD?
                                    </h2>
                                    <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
                                        Be the pioneer! Share the first update and inspire your fellow {community?.name} community.
                                    </p>
                                    <button
                                        onClick={openModal}
                                        className="mt-8 w-full rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-bold tracking-[0.18em] text-white shadow-xl shadow-emerald-200 transition hover:bg-emerald-600 sm:w-auto sm:px-12"
                                    >
                                        IGNITE THE FEED
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 space-y-6">
                                {feed.map((post) => (
                                    <article key={post._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={post.author?.avatar ? (post.author.avatar.startsWith("http") ? post.author.avatar : `${API_BASE_URL}${post.author.avatar}`) : `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.username || 'User'}`}
                                                alt={post.author?.username}
                                                className="h-10 w-10 rounded-full object-cover border border-slate-100"
                                            />
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-950">
                                                    {post.author?.username || "Guardian"}
                                                </h3>
                                                <p className="text-xs text-slate-400">
                                                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
                                            {post.content}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Share Update Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                    <Trees size={24} />
                                </div>
                                <h2 className="mt-4 text-2xl font-black text-slate-950 sm:text-3xl">
                                    Share an Update
                                </h2>
                                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                                    Share something with the {community?.name} community.
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                aria-label="Close update form"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="mt-8">
                            <label htmlFor="updateText" className="mb-2 block text-sm font-bold text-slate-700">
                                Your Update
                            </label>
                            <textarea
                                id="updateText"
                                value={updateText}
                                onChange={(event) => setUpdateText(event.target.value)}
                                placeholder="What is happening in your green community?"
                                rows={6}
                                required
                                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                            />
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    <Send size={18} />
                                    {isSubmitting ? "Sharing..." : "SHARE UPDATE"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Community;