"use client";
// ============================================================
// lib/authContext.tsx
// Simulasi session & role-based access menggunakan React Context.
// Ganti dengan NextAuth / JWT saat integrasi backend nyata.
// ============================================================

import { createContext, useContext, useState, type ReactNode } from "react";
import type { LibraryUser, UserRole } from "@/types";
import { mockUsers } from "@/lib/mockData";

interface AuthContextType {
  currentUser: LibraryUser | null;
  role: UserRole | null;
  login: (userId: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  role: null,
  login: () => {},
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default: login sebagai user biasa (u1) untuk demo
  const [currentUser, setCurrentUser] = useState<LibraryUser | null>(
    mockUsers.find(u => u.id === "u1") ?? null
  );

  const login = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{
      currentUser,
      role: currentUser?.role ?? null,
      login,
      logout,
      isAdmin: currentUser?.role === "admin",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);