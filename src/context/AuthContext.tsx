import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { login as apiLogin, logout as apiLogout } from "../api/authApi";

type AuthState = { token: string | null; email: string | null; role: "USER" | "ADMIN" | null };
type AuthContextValue = AuthState & { isAuthenticated: boolean; login: (email: string, password: string) => Promise<void>; logout: () => void };

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  email: null,
  role: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));
  const [role, setRole] = useState<"USER" | "ADMIN" | null>((localStorage.getItem("role") as any) || null);

  const login = useCallback(async (emailArg: string, password: string) => {
    const res = await apiLogin(emailArg, password);
    setToken(res.token);
    setEmail(res.email);
    setRole(res.role as "USER" | "ADMIN");
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setToken(null);
    setEmail(null);
    setRole(null);
  }, []);

  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
      setEmail(localStorage.getItem("email"));
      setRole((localStorage.getItem("role") as any) || null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    token, email, role, isAuthenticated: Boolean(token), login, logout
  }), [token, email, role, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
