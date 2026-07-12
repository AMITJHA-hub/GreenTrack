import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/api.js";
import { useEffect, useState } from "react";
import {
    Sun,
    Moon,
    CloudSun,
    Leaf,
    Trophy,
    Sprout,
    CircleCheck,
    ArrowRight,
} from "lucide-react";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    console.log(user);
    // Current time
    const currentHour = new Date().getHours();

    let greeting = "";
    let GreetingIcon = Sun;

    if (currentHour < 12) {
        greeting = "Morning";
        GreetingIcon = Sun;
    } else if (currentHour < 17) {
        greeting = "Afternoon";
        GreetingIcon = CloudSun;
    } else {
        greeting = "Evening";
        GreetingIcon = Moon;
    }

    // Today's date
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    // Personalized message
    let motivation = "";

    if ((user?.globalPoints ?? 0) < 100) {
        motivation =
            "Every tree begins with a single step. Start your green journey today!";
    } else if ((user?.globalPoints ?? 0) < 500) {
        motivation =
            "You're making a real impact. Keep planting and inspiring others!";
    } else {
        motivation =
            "Amazing work! You're helping build a greener future for everyone.";
    }
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/users/me`,
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setUser(data.user);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchCurrentUser();
    }, []);
    return (
        <main className="min-h-[calc(100vh-5rem)] bg-transparent px-4 py-8 sm:px-6 md:px-10 lg:px-16 lg:py-12">

            <div className="mx-auto max-w-7xl">

                {/* HERO SECTION */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12 lg:rounded-[3rem] lg:px-12 lg:py-14">

                    <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_0.6fr]">

                        {/* Hero Content */}
                        <div>
                            <div className="flex items-center gap-2 text-emerald-600">
                                <GreetingIcon size={20} />

                                <span className="text-xs font-black tracking-[0.25em]">
                                    GOOD {greeting.toUpperCase()}
                                </span>
                            </div>

                            <p className="mt-4 text-sm font-semibold text-slate-400">
                                {today}
                            </p>

                            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                                Welcome back,
                                <br />
                                <span className="text-emerald-600">
                                    {user?.username || "Guardian"}
                                </span>
                                👋
                            </h1>

                            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-slate-500 sm:text-lg sm:leading-8">
                                {motivation}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-6 text-sm font-semibold text-slate-500">
                                <span>
                                    🏆 {user?.globalPoints ?? 0} Points
                                </span>

                                <span>
                                    🌱 {user?.treeCount ?? 0} {user?.treeCount === 1 ? "Tree" : "Trees"}
                                </span>

                                <span>
                                    ✅ {user?.postCount ?? 0} {user?.postCount === 1 ? "Verified Post" : "Verified Posts"}
                                </span>
                            </div>

                            {/* XP Progress */}
                            <div className="mt-10 max-w-xl rounded-2xl border border-slate-100 bg-slate-50 p-5">

                                <div className="flex items-center justify-between gap-4">

                                    <span className="text-xs font-black tracking-wider text-slate-400">
                                        LEVEL 1 GUARDIAN
                                    </span>

                                    <span className="text-xs font-black text-slate-400">
                                        0 / 100 XP
                                    </span>

                                </div>

                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">

                                    <div
                                        className="h-full rounded-full bg-emerald-500"
                                        style={{ width: "0%" }}
                                    />

                                </div>

                            </div>

                        </div>

                        {/* Hero Icon */}
                        <div className="hidden justify-center lg:flex">

                            <div className="flex h-48 w-48 items-center justify-center rounded-[3rem] bg-white text-emerald-500 shadow-2xl shadow-emerald-200">
                                <Leaf size={100} strokeWidth={1.8} />
                            </div>

                        </div>

                    </div>

                </section>

                {/* STATISTICS */}
                <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {/* Total Points */}
                    <article className="flex min-h-72 flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">

                        <div className="flex items-start justify-between">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <Trophy size={30} />
                            </div>

                            <span className="text-xs font-black tracking-wider text-slate-300">
                                REWARDS
                            </span>

                        </div>

                        <div className="mt-8">

                            <p className="text-sm font-black tracking-wider text-slate-400">
                                TOTAL POINTS
                            </p>

                            <p className="mt-3 text-5xl font-black text-slate-950">
                                {user?.globalPoints ?? 0}
                            </p>

                        </div>
                        <button
                            onClick={() => navigate("/rankings")}
                            className="mt-auto flex items-center gap-3 pt-8 text-sm font-black tracking-wider text-emerald-600"
                        >
                            LEADERBOARD
                            <ArrowRight size={18} />
                        </button>

                    </article>

                    {/* Trees Planted */}
                    <article className="flex min-h-72 flex-col rounded-3xl border border-emerald-200 bg-white p-7 shadow-sm sm:p-8">

                        <div className="flex items-start justify-between">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <Sprout size={30} />
                            </div>

                            <span className="text-xs font-black tracking-wider text-slate-300">
                                PLANTS
                            </span>

                        </div>

                        <div className="mt-8">

                            <p className="text-sm font-black tracking-wider text-slate-400">
                                TREES PLANTED
                            </p>

                            <p className="mt-3 text-5xl font-black text-slate-950">
                                {user?.treeCount ?? 0}
                            </p>

                        </div>

                        <button
                            onClick={() => navigate("/mytrees")}
                            className="mt-auto flex items-center gap-3 pt-8 text-sm font-black tracking-wider text-emerald-600"
                        >
                            MY GARDEN
                            <ArrowRight size={18} />
                        </button>
                    </article>

                    {/* Verified Posts */}
                    <article className="flex min-h-72 flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8 md:col-span-2 xl:col-span-1">

                        <div className="flex items-start justify-between">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                                <CircleCheck size={30} />
                            </div>

                            <span className="text-xs font-black tracking-wider text-slate-300">
                                PROOF
                            </span>

                        </div>

                        <div className="mt-8">

                            <p className="text-sm font-black tracking-wider text-slate-400">
                                VERIFIED POSTS
                            </p>

                            <p className="mt-3 text-5xl font-black text-slate-950">
                                {user?.postCount ?? 0}
                            </p>

                        </div>

                        <p className="mt-auto pt-8 text-sm font-black tracking-wider text-slate-400">
                            KEEP PROTECTING!
                        </p>

                    </article>

                </section>

                {/* ACTION BANNER */}
                <section className="mt-8 rounded-3xl bg-slate-950 px-6 py-14 text-center sm:px-10 sm:py-16 lg:rounded-[3rem] lg:py-20">

                    <h2 className="mx-auto max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                        Every tree you plant is a gift
                        <br className="hidden sm:block" />
                        {" "}to the next generation.
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-7 text-slate-400 sm:text-lg">
                        Join thousands of other Guardians in making the world a
                        greener place.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

                        <button
                            onClick={() => navigate("/feed")}
                            className="w-full rounded-2xl bg-emerald-500 px-10 py-4 text-sm font-black tracking-[0.18em] text-white shadow-xl shadow-emerald-950 transition hover:bg-emerald-600 sm:w-auto"
                        >
                            INSPIRE OTHERS
                        </button>

                        <button
                            onClick={() => navigate("/mytrees")}
                            className="w-full rounded-2xl bg-white px-10 py-4 text-sm font-black tracking-[0.18em] text-slate-950 transition hover:bg-slate-100 sm:w-auto"
                        >
                            PLANT A TREE
                        </button>

                    </div>

                </section>

            </div>
        </main>
    );
}

export default Dashboard;