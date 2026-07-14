import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Trees, Loader2 } from "lucide-react";

import API_BASE_URL from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
    const navigate = useNavigate();
    const { user, setUser, authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && user) {
            navigate("/dashboard");
        }
    }, [user, authLoading, navigate]);

    const [mode, setMode] = useState("login");

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center font-black text-emerald-600 animate-pulse text-lg tracking-wider">
                    Connecting to GreenTrack...
                </div>
            </div>
        );
    }

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const isRegister = mode === "register";

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    function changeMode(newMode) {
        setMode(newMode);
        setError("");

        setFormData({
            username: "",
            email: "",
            password: "",
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setIsLoading(true);
            setError("");

            const endpoint = isRegister
                ? "/users/register"
                : "/users/login";

            const requestBody = isRegister
                ? {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }
                : {
                    email: formData.email,
                    password: formData.password,
                };

            const response = await fetch(
                `${API_BASE_URL}${endpoint}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify(requestBody),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (isRegister
                        ? "Registration failed"
                        : "Login failed")
                );
            }

            if (isRegister) {
                setMode("login");

                setFormData({
                    username: "",
                    email: formData.email,
                    password: "",
                });

                return;
            }

            setUser(data.user);
            navigate("/dashboard");

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleGoogleSuccess(credentialResponse) {
        try {
            setIsGoogleLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/users/google`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        credential: credentialResponse.credential,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Google authentication failed"
                );
            }

            setUser(data.user);
            navigate("/dashboard");

        } catch (error) {
            setError(error.message);
        } finally {
            setIsGoogleLoading(false);
        }
    }

    function handleGoogleError() {
        setError("Google sign-in was unsuccessful. Please try again.");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">

            <div className="w-full max-w-md">

                {}
                <div className="mb-8 flex justify-center">
                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
                            <Trees size={25} />
                        </div>

                        <span className="text-2xl font-black text-emerald-700">
                            GreenTrack
                        </span>

                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

                    {}
                    <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1">

                        <button
                            type="button"
                            onClick={() => changeMode("login")}
                            className={
                                mode === "login"
                                    ? "rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-600 shadow-sm"
                                    : "rounded-xl px-4 py-3 text-sm font-bold text-slate-400"
                            }
                        >
                            LOGIN
                        </button>

                        <button
                            type="button"
                            onClick={() => changeMode("register")}
                            className={
                                mode === "register"
                                    ? "rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-600 shadow-sm"
                                    : "rounded-xl px-4 py-3 text-sm font-bold text-slate-400"
                            }
                        >
                            REGISTER
                        </button>

                    </div>

                    {}
                    <h1 className="mt-8 text-3xl font-black text-slate-950">
                        {isRegister
                            ? "Create your account"
                            : "Welcome back"}
                    </h1>

                    <p className="mt-2 text-slate-500">
                        {isRegister
                            ? "Join GreenTrack and start building your green legacy."
                            : "Login to continue your GreenTrack journey."}
                    </p>

                    {}
                    {error && (
                        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
                            {error}
                        </div>
                    )}

                    {}
                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >

                        {}
                        {isRegister && (
                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-2 block text-sm font-bold text-slate-700"
                                >
                                    Username
                                </label>

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                />
                            </div>
                        )}

                        {}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-bold text-slate-700"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                            />
                        </div>

                        {}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-bold text-slate-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                            />
                        </div>

                        {}
                        {error && (
                            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </p>
                        )}

                        {}
                        <button
                            type="submit"
                            disabled={isLoading || isGoogleLoading}
                            className="w-full rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading
                                ? isRegister
                                    ? "CREATING ACCOUNT..."
                                    : "LOGGING IN..."
                                : isRegister
                                    ? "CREATE ACCOUNT"
                                    : "LOGIN"}
                        </button>

                    </form>

                    {}
                    <div className="my-7 flex items-center gap-4">

                        <div className="h-px flex-1 bg-slate-200" />

                        <span className="text-xs font-bold tracking-wider text-slate-400">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-slate-200" />

                    </div>

                    {}
                    <div className="flex justify-center">

                        {isGoogleLoading ? (
                            <div className="flex h-10 w-full items-center justify-center rounded-lg border border-slate-200 text-sm font-medium text-slate-500">
                                CONNECTING TO GOOGLE...
                            </div>
                        ) : (
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap={false}
                                width="350"
                                text={
                                    isRegister
                                        ? "signup_with"
                                        : "signin_with"
                                }
                            />
                        )}

                    </div>

                </div>

            </div>

        </main>
    );
}

export default Login;