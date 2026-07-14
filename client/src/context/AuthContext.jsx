import { createContext, useContext, useEffect, useState } from "react";
import API_BASE_URL from "../api/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("gt_user");
        try {
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [authLoading, setAuthLoading] = useState(() => !localStorage.getItem("gt_user"));

    const updateLocalUser = (newUser) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem("gt_user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("gt_user");
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/users/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            updateLocalUser(null);
        }
    };

    useEffect(() => {
        async function getCurrentUser() {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/users/me`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    updateLocalUser(null);
                    return;
                }

                const data = await response.json();
                updateLocalUser(data.user);
            } catch (error) {
                console.error("Failed to get current user:", error);
                // Only log out on explicit unauthorized responses, not offline network errors
                if (error.message && (error.message.includes("401") || error.message.includes("403"))) {
                    updateLocalUser(null);
                }
            } finally {
                setAuthLoading(false);
            }
        }

        getCurrentUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser: updateLocalUser,
                logout,
                authLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}