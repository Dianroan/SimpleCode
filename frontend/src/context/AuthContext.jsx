// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { meApi } from "@services/api/auth.js"; 

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | authed | guest

  // pide /me al montar si hay token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("guest");
      return;
    }
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMe = async () => {
    setStatus("loading");
    try {
      const me = await meApi();
      setUser(me);
      setStatus("authed");
    } catch (err) {
      console.warn("[Auth] fetchMe error:", err?.message);
      localStorage.removeItem("token");
      setUser(null);
      setStatus("guest");
    }
  };

  const login = async (token, me) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    if (me) {
      setUser(me);
      setStatus("authed");
    } else {
      // si no me lo pasaron, lo traigo
      await fetchMe();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setStatus("guest");
  };

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
