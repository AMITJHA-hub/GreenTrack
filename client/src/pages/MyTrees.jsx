import { useEffect, useState } from "react";
import {
    Plus,
    Sprout,
    Trees,
    X,
    MapPin,
    Upload,
    Trash2,
} from "lucide-react";
import API_BASE_URL from "../api/api.js";

function MyTrees() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [trees, setTrees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        treeType: "",
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });

    const [locationStatus, setLocationStatus] = useState(
        "Location will be captured automatically."
    );

    useEffect(() => {
        async function fetchUserTrees() {
            try {
                setIsLoading(true);
                setError("");

                const response = await fetch(
                    `${API_BASE_URL}/trees/getusertrees`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch trees"
                    );
                }

                setTrees(data.data);

            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserTrees();
    }, []);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    function openModal() {
        setError("");
        setIsModalOpen(true);

        getCurrentLocation();
    }

    function closeModal() {
        setIsModalOpen(false);

        setError("");

        setSelectedImage(null);

        setPreviewImage("");

        setLocation({
            latitude: null,
            longitude: null,
        });

        setLocationStatus(
            "Location will be captured automatically."
        );
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
        setSelectedImage(null);

        setPreviewImage("");

        setLocation({
            latitude: null,
            longitude: null,
        });

        setLocationStatus(
            "Location will be captured automatically."
        );
    }
    function handleImageChange(event) {
        const file = event.target.files[0];

        if (!file) return;

        setSelectedImage(file);

        const preview = URL.createObjectURL(file);
        setPreviewImage(preview);
    }
    function getCurrentLocation() {
        if (!navigator.geolocation) {
            setLocationStatus("Geolocation is not supported.");
            return;
        }

        setLocationStatus("Fetching current location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                setLocationStatus("Location captured successfully.");
            },
            () => {
                setLocationStatus("Unable to access location.");
            },
            {
                enableHighAccuracy: true,
            }
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");

            if (!selectedImage) {
                throw new Error("Please upload a tree image.");
            }

            if (
                location.latitude === null ||
                location.longitude === null
            ) {
                throw new Error("Location not available.");
            }

            const form = new FormData();

            form.append("treeType", formData.treeType);

            form.append("image", selectedImage);

            form.append("latitude", location.latitude);

            form.append("longitude", location.longitude);

            const response = await fetch(
                `${API_BASE_URL}/trees/register`,
                {
                    method: "POST",

                    credentials: "include",

                    body: form,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to register tree"
                );
            }

            setTrees((previousTrees) => [
                data.data.tree,
                ...previousTrees,
            ]);

            setFormData({
                treeType: "",
            });

            setIsModalOpen(false);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleDeleteTree(treeId) {
        setDeleteConfirmId(treeId);
    }

    async function confirmDelete(treeId) {
        try {
            const response = await fetch(`${API_BASE_URL}/trees/delete/${treeId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete tree");
            }

            setTrees((previousTrees) => previousTrees.filter((tree) => tree._id !== treeId));
            alert(data.message || "Tree deleted successfully.");
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <main className="min-h-[calc(100vh-5rem)] bg-transparent px-4 py-8 sm:px-6 md:px-10 lg:px-16 lg:py-12">

            {/* Page Header */}
            <section className="flex flex-col gap-8 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between lg:pb-10">

                <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
                        <Trees
                            size={16}
                            className="text-emerald-600"
                        />

                        <span className="text-xs font-bold tracking-[0.2em] text-emerald-700 sm:tracking-[0.25em]">
                            GREEN PORTFOLIO
                        </span>
                    </div>

                    <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                        MY FOREST
                    </h1>

                    <p className="mt-3 text-base font-medium text-slate-500 sm:text-lg lg:text-xl">
                        Nurturing {trees.length}{" "}
                        {trees.length === 1 ? "life" : "lives"} across the planet.
                    </p>
                </div>

                <button
                    onClick={openModal}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold tracking-wider text-white shadow-lg transition hover:bg-slate-800 md:w-auto md:px-8 md:py-5"
                >
                    <Plus size={20} />
                    REGISTER A TREE
                </button>

            </section>

            {/* Loading */}
            {isLoading && (
                <section className="mt-12 flex min-h-[400px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
                    <p className="font-bold text-slate-500">
                        Loading your forest...
                    </p>
                </section>
            )}

            {/* Page Error */}
            {!isLoading && error && !isModalOpen && (
                <div className="mt-8 rounded-2xl bg-red-50 px-5 py-4 font-medium text-red-600">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && trees.length === 0 && (
                <section className="mt-8 flex min-h-[480px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-5 py-12 sm:mt-12 sm:min-h-[560px] sm:rounded-[3rem]">

                    <div className="flex max-w-2xl flex-col items-center text-center">

                        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl shadow-emerald-100 sm:mb-10 sm:h-32 sm:w-32">
                            <Trees
                                size={48}
                                strokeWidth={2}
                                className="text-emerald-500"
                            />
                        </div>

                        <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">
                            YOUR FOREST AWAITS ITS FIRST SEED
                        </h2>

                        <p className="mt-5 text-base leading-7 text-slate-500 sm:text-lg sm:leading-8 lg:text-xl">
                            Every great forest starts with a single sapling.
                            Register your tree today and track its impact on the world.
                        </p>

                        <button
                            onClick={openModal}
                            className="mt-8 w-full rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-bold tracking-[0.15em] text-white shadow-xl shadow-emerald-200 transition hover:bg-emerald-600 sm:mt-10 sm:w-auto sm:px-14 sm:py-5"
                        >
                            BEGIN YOUR LEGACY
                        </button>

                    </div>

                </section>
            )}

            {/* Tree Cards */}
            {!isLoading && trees.length > 0 && (
                <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                    {trees.map((tree) => (
                        <article
                            key={tree._id}
                            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >

                            <img
                                src={`${API_BASE_URL}${tree.photoUrl}`}
                                alt={tree.treeType}
                                className="h-56 w-full object-cover"
                            />

                            <div className="p-6">

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <Sprout size={18} />
                                        <span className="text-xs font-black tracking-wider">
                                            REGISTERED TREE
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteTree(tree._id)}
                                        className="text-red-500 hover:text-red-700 transition p-1.5 rounded-xl hover:bg-red-50"
                                        title="Delete Tree"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <h2 className="mt-4 text-2xl font-black text-slate-950">
                                    {tree.treeType}
                                </h2>

                                <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                                    <MapPin
                                        size={18}
                                        className="mt-0.5 shrink-0 text-emerald-500"
                                    />

                                    <span>
                                        Longitude:{" "}
                                        {tree.location?.coordinates?.[0]}
                                        <br />
                                        Latitude:{" "}
                                        {tree.location?.coordinates?.[1]}
                                    </span>
                                </div>

                            </div>

                        </article>
                    ))}

                </section>
            )}

            {/* Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

                        {/* Modal Header */}
                        <div className="flex items-start justify-between gap-4">

                            <div>
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                    <Sprout size={24} />
                                </div>

                                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                                    Register a Tree
                                </h2>

                                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                                    Submit a tree for tracking and verification.
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
                            >
                                <X size={24} />
                            </button>

                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-5"
                        >

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Tree Species
                                </label>

                                <input
                                    name="treeType"
                                    type="text"
                                    value={formData.treeType}
                                    onChange={handleChange}
                                    placeholder="Example: Neem, Mango, Banyan"
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Tree Photo
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-8 transition hover:border-emerald-500 hover:bg-emerald-50">

                                    <Upload
                                        size={36}
                                        className="mb-3 text-emerald-500"
                                    />

                                    <span className="text-sm font-semibold text-slate-700">
                                        Choose Image
                                    </span>

                                    <span className="mt-1 text-xs text-slate-500">
                                        JPG, PNG or JPEG
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                </label>
                            </div>
                            {previewImage && (
                                <div className="overflow-hidden rounded-2xl border border-slate-200">

                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="h-56 w-full object-cover"
                                    />

                                </div>
                            )}
                            <div className="rounded-xl bg-slate-50 p-4">
                                <div className="flex items-start gap-3">
                                    <MapPin
                                        size={20}
                                        className="mt-0.5 text-emerald-500"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">
                                            Current Location
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {locationStatus}
                                        </p>
                                        {location.latitude !== null && location.longitude !== null && (
                                            <div className="mt-2 text-xs font-semibold text-emerald-700">
                                                <p>Latitude: {location.latitude}</p>
                                                <p>Longitude: {location.longitude}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                    {error}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                    className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Sprout size={19} />

                                    {isSubmitting
                                        ? "Registering..."
                                        : "Register Tree"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                        <h2 className="text-xl font-bold text-slate-950">
                            Delete Tree
                        </h2>
                        <p className="mt-3 text-sm text-slate-500">
                            Are you sure you want to delete this tree? This action is permanent and will deduct 10 points.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    confirmDelete(deleteConfirmId);
                                    setDeleteConfirmId(null);
                                }}
                                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
}

export default MyTrees;