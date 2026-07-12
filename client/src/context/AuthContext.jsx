import { createContext, useContext, useEffect, useState } from "react";
import API_BASE_URL from "../api/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

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
                    setUser(null);
                    return;
                }

                const data = await response.json();

                setUser(data.user);
            } catch (error) {
                console.error("Failed to get current user:", error);
                setUser(null);
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
                setUser,
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