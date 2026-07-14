import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Image,
    MapPin,
    Smile,
    Leaf,
    Shield,
    Users,
    TrendingUp,
    Award,
    ChevronRight,
    X,
    Send,
    Heart,
    MessageSquare,
    Trash2
} from "lucide-react";
import { useEffect } from "react"; // make sure to import useEffect at the top
import API_BASE_URL from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";


function Feed() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [totalForestage, setTotalForestage] = useState(0);
    const [starTeams, setStarTeams] = useState([]);
    const [trends, setTrends] = useState([]);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [postText, setPostText] = useState("");

    async function fetchCurrentUser() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                credentials: "include"
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    useEffect(() => {
        async function fetchFeed() {
            try {
                const response = await fetch(`${API_BASE_URL}/posts/getcommunityfeed`, {
                    credentials: "include" // needed to send access cookies
                });
                const data = await response.json();
                if (data.success) {
                    setPosts(data.feed);
                    setTotalForestage(data.totalTrees || 0);
                    setStarTeams(data.starTeams || []);
                    setTrends(data.trendingTrees || []);
                }
            } catch (error) {
                console.error("Error fetching feed:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFeed();
        fetchCurrentUser();
    }, []);
    const handleLikeToggle = async (postId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/togglelikepost/${postId}`, {
                method: "POST",
                credentials: "include"
            });
            const data = await response.json();

            if (data.success) {
                // Update the post in the local state
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId
                            ? {
                                ...post,
                                likes: data.hasLiked
                                    ? [...(post.likes || []), user?._id]
                                    : (post.likes || []).filter((id) => id !== user?._id)
                            }
                            : post
                    )
                );
                fetchCurrentUser();
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };
    const [commentTexts, setCommentTexts] = useState({});
    const [expandedCommentsPostId, setExpandedCommentsPostId] = useState(null); // Tracks which post's comment box is open

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        const content = commentTexts[postId];
        if (!content || content.trim() === "") return;

        try {
            const response = await fetch(`${API_BASE_URL}/posts/addcomment/${postId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content }),
                credentials: "include"
            });
            const data = await response.json();

            if (data.success) {
                // Update the comments in local state
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId
                            ? { ...post, comments: data.comments }
                            : post
                    )
                );
                // Clear input for this post
                setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
                fetchCurrentUser();
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };
    const handlePostDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/posts/deletepost/${postId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const data = await response.json();

            if (data.success) {
                // Remove the deleted post from the local state list
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
                fetchCurrentUser();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleLocationFetch = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setIsFetchingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Fetch city name from coordinates using OpenStreetMap Nominatim API
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state || "";
                    const country = data.address?.country || "";
                    const locationName = city && country ? `${city}, ${country}` : data.display_name || `(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

                    setPostText((prev) => `${prev}\n📍 ${locationName}`);
                } catch (error) {
                    setPostText((prev) => `${prev}\n📍 (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                } finally {
                    setIsFetchingLocation(false);
                }
            },
            (error) => {
                console.error("Error fetching location:", error);
                alert("Unable to retrieve your location. Please check location permissions.");
                setIsFetchingLocation(false);
            }
        );
    };

    function openPostModal() {
        setIsPostModalOpen(true);
    }

    function closePostModal() {
        setIsPostModalOpen(false);
        setPostText("");
    }
    const fileInputRef = useRef(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("content", postText);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/posts/createpost`, {

                method: "POST",
                body: formData,
                credentials: "include"
            });
            const data = await response.json();

            if (data.success) {
                // Add the new post to the top of the feed list
                setPosts([data.post, ...posts]);
                closePostModal();
                setSelectedFile(null);
                setPreviewUrl("");
                fetchCurrentUser();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    }

    return (
        <main className="min-h-[calc(100vh-5rem)] bg-transparent px-4 py-6 sm:px-6 lg:px-8">

            <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_280px]">

                {/* LEFT SIDEBAR */}
                <aside className="order-2 space-y-6 lg:order-1">

                    {/* Profile Card */}
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                        <div className="h-24 bg-emerald-500" />

                        <div className="px-6 pb-6">

                            <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-slate-950 text-2xl text-white shadow-lg">
                                👤
                            </div>

                            <h2 className="mt-5 text-xl font-black text-slate-950">
                                {user?.username || "Guest"}
                            </h2>


                            <div className="mt-2 flex items-center gap-2 text-slate-500">
                                <Shield size={17} className="text-emerald-500" />
                                <span>Level {Math.floor((user?.globalPoints || 0) / 100) + 1} Guardian</span>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                <span className="font-bold text-slate-400">
                                    Total Points
                                </span>
                                <span className="font-black text-emerald-600">
                                    {user?.globalPoints || 0}
                                </span>

                            </div>

                        </div>
                    </div>

                    {/* Community Card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">
                            <MapPin size={20} className="text-emerald-500" />

                            <p className="mt-2 font-bold text-slate-700">
                                {user?.community?.name || "Local Earth Guardians"}
                            </p>

                        </div>

                        <div className="mt-6 rounded-2xl bg-slate-50 p-4">

                            <p className="text-xs font-bold tracking-wider text-slate-400">
                                LOCAL CHAPTER
                            </p>

                            <p className="mt-2 font-bold text-slate-700">
                                Global Earth Guardians
                            </p>

                        </div>

                        <button
                            onClick={() => navigate("/community")}
                            className="mt-6 flex w-full items-center justify-between font-bold text-emerald-600"
                        >
                            View Community Feed
                            <ChevronRight size={20} />
                        </button>

                    </div>

                    {/* Achievements */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">
                            <Award size={20} className="text-emerald-500" />

                            <h2 className="text-lg font-black text-slate-950">
                                Achievements
                            </h2>
                        </div>

                        <p className="mt-5 text-sm text-slate-400">
                            Your achievements will appear here.
                        </p>

                    </div>

                </aside>

                {/* CENTER FEED */}
                <section className="order-1 min-w-0 space-y-6 lg:order-2">

                    {/* Create Post Box */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                        <button
                            onClick={openPostModal}
                            className="flex w-full items-center gap-4"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                                👤
                            </div>

                            <div className="w-full rounded-2xl bg-slate-50 px-5 py-4 text-left font-medium text-slate-500">
                                What&apos;s happening in your garden?
                            </div>
                        </button>

                        <div className="mt-4 grid grid-cols-3 border-t border-slate-100 pt-4">

                            <button
                                onClick={openPostModal}
                                className="flex items-center justify-center gap-2 py-2 font-bold text-slate-500 transition hover:text-emerald-600"
                            >
                                <Image size={20} className="text-emerald-500" />
                                <span className="hidden sm:inline">PHOTO</span>
                            </button>

                            <button
                                onClick={openPostModal}
                                className="flex items-center justify-center gap-2 py-2 font-bold text-slate-500 transition hover:text-emerald-600"
                            >
                                <MapPin size={20} className="text-emerald-500" />
                                <span className="hidden sm:inline">LOCATION</span>
                            </button>

                            <button
                                onClick={openPostModal}
                                className="flex items-center justify-center gap-2 py-2 font-bold text-slate-500 transition hover:text-emerald-600"
                            >
                                <Smile size={20} className="text-emerald-500" />
                                <span className="hidden sm:inline">FEELING</span>
                            </button>

                        </div>

                    </div>

                    {/* Empty Feed */}
                    {/* Dynamic Feed Posts */}
                    {isLoading ? (
                        <div className="flex min-h-[200px] items-center justify-center rounded-3xl border border-slate-200 bg-white font-bold text-slate-500">
                            Loading feed...
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex min-h-[520px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-12">
                            <div className="flex max-w-xl flex-col items-center text-center">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                    <Leaf size={48} />
                                </div>
                                <h1 className="mt-8 text-2xl font-black text-slate-950 sm:text-3xl">
                                    BE THE FIRST TO INSPIRE!
                                </h1>
                                <p className="mt-4 max-w-md text-base leading-7 text-slate-500 sm:text-lg">
                                    The global feed is waiting for your tree updates.
                                    Share your progress with the world!
                                </p>
                                <button
                                    onClick={openPostModal}
                                    className="mt-8 rounded-2xl bg-emerald-500 px-8 py-4 font-bold text-white shadow-xl shadow-emerald-200 transition hover:bg-emerald-600"
                                >
                                    Create First Post
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <div key={post._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                    {/* Author Profile */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white font-black text-sm">
                                                {post.author?.username?.slice(0, 2).toUpperCase() || "👤"}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-950">
                                                    {post.author?.username || "Anonymous"}
                                                </h4>
                                                <p className="text-xs font-bold text-slate-400">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {post.author?._id === user?._id && (
                                            <button
                                                onClick={() => handlePostDelete(post._id)}
                                                className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Post Content */}
                                    <p className="mt-4 text-slate-700 leading-relaxed">
                                        {post.content}
                                    </p>

                                    {/* Optional Image Attachment */}
                                    {post.imageUrl && (
                                        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                                            <img
                                                src={post.imageUrl}
                                                alt="Post attachment"
                                                className="max-h-[500px] w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    {/* Post Action Footer */}
                                    <div className="mt-6 flex items-center gap-6 border-t border-slate-100 pt-4">
                                        {/* Like Button */}
                                        <button
                                            onClick={() => handleLikeToggle(post._id)}
                                            className={`flex items-center gap-2 font-bold transition ${post.likes?.includes(user?._id)
                                                ? "text-rose-500"
                                                : "text-slate-400 hover:text-rose-500"
                                                }`}
                                        >
                                            <Heart
                                                size={18}
                                                fill={post.likes?.includes(user?._id) ? "currentColor" : "none"}
                                            />
                                            <span>{post.likes?.length || 0}</span>
                                        </button>

                                        {/* Comment Toggle Button */}
                                        <button
                                            onClick={() => setExpandedCommentsPostId(expandedCommentsPostId === post._id ? null : post._id)}
                                            className="flex items-center gap-2 font-bold text-slate-400 hover:text-emerald-500 transition"
                                        >
                                            <MessageSquare size={18} />
                                            <span>{post.comments?.length || 0}</span>
                                        </button>
                                    </div>

                                    {/* Expandable Comments List & Input */}
                                    {expandedCommentsPostId === post._id && (
                                        <div className="mt-4 border-t border-slate-100 pt-4 space-y-4">
                                            {/* Comment list */}
                                            {post.comments && post.comments.length > 0 && (
                                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                    {post.comments.map((comment) => (
                                                        <div key={comment._id} className="flex items-start gap-3 text-sm">
                                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 font-bold text-[10px] text-slate-700 shrink-0">
                                                                {comment.author?.username?.slice(0, 2).toUpperCase() || "👤"}
                                                            </div>
                                                            <div className="flex-1 rounded-2xl bg-slate-50 px-4 py-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-bold text-slate-900">{comment.author?.username}</span>
                                                                    <span className="text-[10px] text-slate-400">
                                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <p className="mt-1 text-slate-600">{comment.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add comment form */}
                                            <form
                                                onSubmit={(e) => handleCommentSubmit(e, post._id)}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    value={commentTexts[post._id] || ""}
                                                    onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post._id]: e.target.value }))}
                                                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500 transition"
                                                />
                                                <button
                                                    type="submit"
                                                    className="rounded-xl bg-emerald-500 p-2 text-white hover:bg-emerald-600 transition shrink-0"
                                                >
                                                    <Send size={16} />
                                                </button>
                                            </form>
                                        </div>
                                    )}


                                </div>
                            ))}
                        </div>
                    )}


                </section>

                {/* RIGHT SIDEBAR */}
                <aside className="order-3 hidden space-y-6 xl:block">

                    {/* Global Trends */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <TrendingUp
                                size={20}
                                className="text-emerald-500"
                            />
                            <h2 className="font-black tracking-wider text-slate-950">
                                GLOBAL TRENDS
                            </h2>
                        </div>
                        {trends.length === 0 ? (
                            <p className="mt-6 text-xs font-bold tracking-wider text-slate-400">
                                OBSERVING HABITAT...
                            </p>
                        ) : (
                            <div className="mt-6 space-y-4">
                                {trends.map((trend) => (
                                    <div key={trend._id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                        <span className="text-sm font-bold text-slate-800 capitalize">{trend._id}</span>
                                        <span className="text-xs font-black text-emerald-600">{trend.count} planted</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Total Forestage */}
                    <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl">
                        <p className="text-xs font-black tracking-[0.25em] text-emerald-400">
                            TOTAL FORESTAGE
                        </p>
                        <p className="mt-6 text-5xl font-black">
                            {totalForestage}
                        </p>
                        <p className="mt-2 text-xs font-bold tracking-wider text-slate-400">
                            LIVES ROOTED GLOBALLY
                        </p>
                        <div className="mt-8 h-2 rounded-full bg-slate-800" />
                    </div>

                    {/* Star Teams */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Users
                                    size={20}
                                    className="text-emerald-500"
                                />
                                <h2 className="font-black tracking-wider text-slate-950">
                                    STAR TEAMS
                                </h2>
                            </div>
                            <button onClick={() => navigate("/rankings")} className="text-xs font-bold text-emerald-600">
                                SEE ALL
                            </button>
                        </div>
                        {starTeams.length === 0 ? (
                            <p className="mt-6 text-xs font-bold tracking-wider text-slate-400">
                                FORMING LEGIONS...
                            </p>
                        ) : (
                            <div className="mt-6 space-y-4">
                                {starTeams.map((team, idx) => (
                                    <div key={team._id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                                            <span className="text-sm font-bold text-slate-800">{team.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-emerald-600">{team.totalPoints} pts</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </aside>

            </div>




            {isPostModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4">

                    <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

                        <div className="flex items-start justify-between">

                            <div>
                                <h2 className="text-2xl font-black text-slate-950">
                                    Create Post
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Share your progress with the GreenTrack community.
                                </p>
                            </div>

                            <button
                                onClick={closePostModal}
                                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={24} />
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6"
                        >
                            <textarea
                                value={postText}
                                onChange={(event) =>
                                    setPostText(event.target.value)
                                }
                                placeholder="What's happening in your garden?"
                                rows={6}
                                required
                                className="w-full resize-none rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                            />
                            {/* Preview selected image */}
                            {previewUrl && (
                                <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                                    <img src={previewUrl} alt="Preview" className="max-h-60 w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setPreviewUrl("");
                                        }}
                                        className="absolute right-3 top-3 rounded-full bg-slate-900/60 p-2 text-white hover:bg-slate-900/80 transition"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <div className="mt-4 flex gap-3 border-t border-slate-100 py-4">
                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                {/* Button that triggers the file input click */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                    className="rounded-xl p-3 text-emerald-500 transition hover:bg-emerald-50"
                                >
                                    <Image size={22} />
                                </button>


                                <button
                                    type="button"
                                    onClick={handleLocationFetch}
                                    disabled={isFetchingLocation}
                                    className="rounded-xl p-3 text-emerald-500 transition hover:bg-emerald-50 disabled:opacity-50"
                                >
                                    <MapPin size={22} />
                                </button>

                                <button
                                    type="button"
                                    className="rounded-xl p-3 text-emerald-500 transition hover:bg-emerald-50"
                                >
                                    <Smile size={22} />
                                </button>

                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={closePostModal}
                                    className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600"
                                >
                                    CANCEL
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white transition hover:bg-emerald-600"
                                >
                                    <Send size={18} />
                                    POST
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </main>
    );
}

export default Feed;