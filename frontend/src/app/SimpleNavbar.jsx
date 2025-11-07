import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext.jsx";

export default function SimpleNavbar() {
  const { user, status, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // o /login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom mb-3">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          SimpleCode
        </Link>

        <div className="ms-auto d-flex gap-2 align-items-center">
          {/* estado de carga */}
          {status === "loading" || status === "idle" ? (
            <span className="text-muted small">Verificando sesión…</span>
          ) : null}

          {/* NO autenticado */}
          {status === "guest" ? (
            <>
              <Link
                className={`btn btn-link ${location.pathname === "/login" ? "fw-semibold" : ""}`}
                to="/login"
              >
                Iniciar sesión
              </Link>
              <Link className="btn btn-primary" to="/register">
                Crear cuenta
              </Link>
            </>
          ) : null}

          {/* AUTENTICADO */}
          {status === "authed" && user ? (
            <>
              <span className="text-muted small d-none d-md-inline">
                Hola, <strong>{user.username}</strong>
              </span>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                Cerrar sesión
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
