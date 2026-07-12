import { useState } from "react";
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
} from "lucide-react";

function Feed() {
    const navigate = useNavigate();

    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [postText, setPostText] = useState("");

    function openPostModal() {
        setIsPostModalOpen(true);
    }

    function closePostModal() {
        setIsPostModalOpen(false);
        setPostText("");
    }

    function handleSubmit(event) {
        event.preventDefault();

        console.log({
            content: postText,
        });

        closePostModal();
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
                                USER
                            </h2>

                            <div className="mt-2 flex items-center gap-2 text-slate-500">
                                <Shield size={17} className="text-emerald-500" />
                                <span>Level 1 Guardian</span>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                <span className="font-bold text-slate-400">
                                    Total Points
                                </span>

                                <span className="font-black text-emerald-600">
                                    0
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Community Card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">
                            <MapPin size={20} className="text-emerald-500" />

                            <h2 className="text-lg font-black text-slate-950">
                                Your Community
                            </h2>
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

                        <p className="mt-6 text-xs font-bold tracking-wider text-slate-400">
                            OBSERVING HABITAT...
                        </p>

                    </div>

                    {/* Total Forestage */}
                    <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl">

                        <p className="text-xs font-black tracking-[0.25em] text-emerald-400">
                            TOTAL FORESTAGE
                        </p>

                        <p className="mt-6 text-5xl font-black">
                            0
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

                            <button className="text-xs font-bold text-emerald-600">
                                SEE ALL
                            </button>

                        </div>

                        <p className="mt-6 text-xs font-bold tracking-wider text-slate-400">
                            FORMING LEGIONS...
                        </p>

                    </div>

                </aside>

            </div>

            {/* CREATE POST MODAL */}
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

                            <div className="mt-4 flex gap-3 border-t border-slate-100 py-4">

                                <button
                                    type="button"
                                    className="rounded-xl p-3 text-emerald-500 transition hover:bg-emerald-50"
                                >
                                    <Image size={22} />
                                </button>

                                <button
                                    type="button"
                                    className="rounded-xl p-3 text-emerald-500 transition hover:bg-emerald-50"
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