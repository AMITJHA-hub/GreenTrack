import { Trophy } from "lucide-react";
import { useState } from "react";

function Rankings() {
    const [activeTab, setActiveTab] = useState("planters");

    const planters = [
        { id: 1, name: "Aarav Sharma", trees: 42, points: 1260 },
        { id: 2, name: "Priya Verma", trees: 35, points: 1050 },
        { id: 3, name: "Rahul Singh", trees: 29, points: 870 },
    ];

    const communities = [
        { id: 1, name: "Green Warriors", members: 28, points: 5400 },
        { id: 2, name: "Eco Champions", members: 21, points: 4200 },
        { id: 3, name: "Planet Protectors", members: 17, points: 3600 },
    ];

    const currentData =
        activeTab === "planters" ? planters : communities;

    return (
        <main className="min-h-[calc(100vh-5rem)] bg-transparent px-4 py-10 sm:px-6 md:px-8 md:py-16">
            <section className="mx-auto flex max-w-5xl flex-col items-center text-center">

                Badge
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
                    <Trophy size={16} className="text-emerald-600" />

                    <span className="text-xs font-bold tracking-[0.25em] text-emerald-700">
                        GLOBAL STANDINGS
                    </span>
                </div>

                {/* Heading */}
                <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                    LEADERBOARD
                </h1>

                <p className="mt-3 text-base font-medium text-slate-500 sm:text-lg md:text-xl">
                    Competing to restore the planet&apos;s lungs.
                </p>

                {/* Tabs */}
                <div className="mt-10 flex w-full max-w-xl flex-col rounded-2xl border border-slate-200 bg-slate-100 p-1 sm:mt-12 sm:flex-row">

                    <button
                        onClick={() => setActiveTab("planters")}
                        className={
                            activeTab === "planters"
                                ? "w-full rounded-xl border border-emerald-200 bg-white px-4 py-4 text-sm font-bold tracking-wider text-emerald-600 shadow-sm sm:px-8"
                                : "w-full rounded-xl px-4 py-4 text-sm font-bold tracking-wider text-slate-400 sm:px-8"
                        }
                    >
                        TOP PLANTERS
                    </button>

                    <button
                        onClick={() => setActiveTab("communities")}
                        className={
                            activeTab === "communities"
                                ? "w-full rounded-xl border border-emerald-200 bg-white px-4 py-4 text-sm font-bold tracking-wider text-emerald-600 shadow-sm sm:px-8"
                                : "w-full rounded-xl px-4 py-4 text-sm font-bold tracking-wider text-slate-400 sm:px-8"
                        }
                    >
                        TOP COMMUNITIES
                    </button>

                </div>

                {/* Leaderboard Content */}
                <div className="mt-8 w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-4 sm:mt-10 sm:p-8">

                    {currentData.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border-b border-slate-100 px-3 py-5 text-left last:border-b-0 sm:px-6"
                        >
                            <div className="flex items-center gap-4">

                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-700">
                                    #{index + 1}
                                </span>

                                <div>
                                    <h2 className="font-bold text-slate-900 sm:text-lg">
                                        {item.name}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {activeTab === "planters"
                                            ? `${item.trees} trees planted`
                                            : `${item.members} members`}
                                    </p>
                                </div>

                            </div>

                            <span className="text-sm font-bold text-emerald-600 sm:text-base">
                                {item.points} points
                            </span>
                        </div>
                    ))}

                </div>

            </section>
        </main>
    );
}

export default Rankings;