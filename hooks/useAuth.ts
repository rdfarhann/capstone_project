// hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: number;
  name: string;
  nisn: string;
  email: string;
  role: "admin" | "user";
  class_name: string;
  avatar_url: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setUser(json ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return { user, loading, logout };
}