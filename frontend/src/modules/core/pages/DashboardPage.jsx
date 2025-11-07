import { useAuth } from "@context/AuthContext.jsx";

export default function DashboardPage() {
  const { user, status, logout } = useAuth();

  if (status === "idle" || status === "loading") {
    return (
      <div className="container py-4">
        <p className="text-muted">Cargando sesión…</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="h4 mb-1">Panel</h1>
          <p className="text-muted mb-0">
            {user ? `Bienvenido, ${user.username}` : "Sesión activa."}
          </p>
        </div>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {user ? (
            <>
              <p><strong>Usuario:</strong> {user.username}</p>
              <p><strong>Correo:</strong> {user.email}</p>
            </>
          ) : (
            <p className="text-muted mb-0">No se pudo cargar el usuario.</p>
          )}
        </div>
      </div>
    </div>
  );
}
