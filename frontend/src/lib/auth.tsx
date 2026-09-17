"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthResponse } from "@/types";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const savedToken = localStorage.getItem("resumeiq_token");
        if (savedToken) {
          const profile = await api.get<User>("/auth/me");
          setUser(profile);
          localStorage.setItem("resumeiq_user", JSON.stringify(profile));
        }
      } catch (err) {
        api.removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await api.post<AuthResponse>("/auth/login/json", {
      email,
      password: pass,
    });
    api.setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("resumeiq_user", JSON.stringify(data.user));
  };

  const register = async (email: string, pass: string, name: string) => {
    const data = await api.post<AuthResponse>("/auth/register", {
      email,
      password: pass,
      full_name: name,
    });
    api.setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("resumeiq_user", JSON.stringify(data.user));
  };

  const logout = () => {
    api.removeToken();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
