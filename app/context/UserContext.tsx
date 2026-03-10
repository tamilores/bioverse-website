"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { getCookie } from "cookies-next";

interface User {
    id: number;
    username: string;
    isAdmin: boolean;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function getInitialUser(): User | null {
    const cookie = getCookie("user");
    if (!cookie) return null;

    try {
        return JSON.parse(String(cookie)) as User;
    } catch {
        return null;
    }
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => getInitialUser());

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
}