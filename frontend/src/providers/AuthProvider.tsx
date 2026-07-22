"use client"

import { getToken, removeToken, setToken } from "@/lib/auth";
import { getCurrentUser } from "@/service/auth";
import { User } from "@/types/auth";
import { createContext, ReactNode, use, useEffect, useState } from "react";

interface AuthContextType {
    user: User | null
    loading: boolean
    saveToken: (token: string, user: User) => void
    logout: () => void
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
    children: ReactNode
}

export default function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);



    const refreshUser = async () => {
        try {
            const user = await getCurrentUser();

            setUser(user)
        } catch (error) {
            removeToken();

            setUser(null);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const initialize = async () => {
            const token = getToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const user = await getCurrentUser();
                setUser(user);
            } catch {
                removeToken();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);



    const saveToken = (token: string, user: User) => {
        console.log(token)
        setToken(token);
        setUser(user);
    }

    const logout = () => {
        removeToken();
        setUser(null);
    };
    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                saveToken,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}


