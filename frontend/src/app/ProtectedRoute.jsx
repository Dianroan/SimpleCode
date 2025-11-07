// src/app/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext.jsx";

export default function ProtectedRoute({ element }) {
  const { status } = useAuth();

  if (status === "idle" || status === "loading") {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Cargando sesión…</p>
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to="/login" replace />;
  }

  return element;
}
