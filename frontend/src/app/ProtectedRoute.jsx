/**
 * Componente para proteger rutas que requieren autenticación
 *
 * Si NO hay usuario autenticado -> redirige a la página de inicio (/)
 * Si SÍ hay usuario -> muestra el contenido de la ruta
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
}
