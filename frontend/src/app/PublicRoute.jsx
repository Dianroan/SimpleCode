import { Navigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext.jsx";

// Para páginas públicas: si ya hay sesión -> manda a /ruta
export default function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/ruta" replace />;
  return children;
}
