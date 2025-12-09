/**
 * Contexto de Autenticación Global
 *
 * Maneja el estado de autenticación del usuario en toda la aplicación:
 * - Verifica si hay token al cargar la app
 * - Obtiene los datos del usuario desde el backend
 * - Provee funciones para login y logout
 *
 * Estados posibles:
 * - "idle": Estado inicial
 * - "loading": Verificando token o cargando datos
 * - "authed": Usuario autenticado
 * - "guest": Sin autenticación
 */

import { createContext, useContext, useEffect, useState } from "react";
import { meApi } from "@services/api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle");

  // Al montar, verificar si hay token guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("guest");
      return;
    }
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Obtiene los datos del usuario desde el backend usando el token guardado
   * Si el token es inválido, limpia la sesión
   */
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

  /**
   * Inicia sesión guardando el token y datos del usuario
   * @param {string} token - JWT del usuario
   * @param {Object} me - Datos del usuario (opcional)
   */
  const login = async (token, me) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    if (me) {
      setUser(me);
      setStatus("authed");
    } else {
      await fetchMe();
    }
  };

  /**
   * Cierra sesión limpiando el token y datos del usuario
   */
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

/**
 * Hook para acceder al contexto de autenticación
 * @returns {{ user, status, login, logout }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
