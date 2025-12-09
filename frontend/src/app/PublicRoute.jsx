/**
 * Componente para rutas públicas (login, register, landing)
 *
 * Si ya hay usuario autenticado -> redirige a /ruta
 * Si NO hay usuario -> muestra el contenido público
 *
 * Evita que usuarios autenticados accedan al login/register innecesariamente
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext.jsx";

export default function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/ruta" replace />;
  return children;
}
