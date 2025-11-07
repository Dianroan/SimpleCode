import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { loginApi, meApi, logoutApi } from "../services/api/auth";

const LS_USER = "user";
const LS_TOKEN = "token";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(LS_USER);
    return saved ? JSON.parse(saved) : null;
  });
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  }, [user]);

  // Rehidratar sesión SOLO si hay token
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem(LS_TOKEN);
        if (!token) return;
        const data = await meApi(); // http.js ya adjunta Bearer
        if (data?.user) setUser(data.user);
      } catch {
        localStorage.removeItem(LS_TOKEN);
        setUser(null);
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  const login = useCallback(async (credentials) => {
    // 1) pedir token al backend
    const { token, user } = await loginApi(credentials);
    // 2) guardar token ANTES de cualquier /me
    localStorage.setItem(LS_TOKEN, token);
    // 3) setear usuario en contexto
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {}
    localStorage.removeItem(LS_TOKEN);
    setUser(null);
  }, []);

  if (!bootstrapped) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };
