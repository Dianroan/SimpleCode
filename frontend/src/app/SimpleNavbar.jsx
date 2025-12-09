import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext.jsx";
import StreakIndicator from "@modules/core/components/StreakIndicator.jsx";

export default function SimpleNavbar() {
  const { user, status, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // o /login
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light mb-3"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
        backdropFilter: "blur(10px)",
        borderBottom: "2px solid rgba(99, 102, 241, 0.1)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "1.5rem",
          }}
        >
          SimpleCode
        </Link>

        <div className="ms-auto d-flex gap-3 align-items-center">
          {/* estado de carga */}
          {status === "loading" || status === "idle" ? (
            <span className="text-muted small">
              <div
                className="spinner"
                style={{ width: "20px", height: "20px", borderWidth: "2px" }}
              />
            </span>
          ) : null}

          {/* NO autenticado */}
          {status === "guest" ? (
            <>
              <Link
                className="btn btn-link"
                to="/login"
                style={{
                  color: "#667eea",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Iniciar sesión
              </Link>
              <Link
                className="btn"
                to="/register"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "0.75rem",
                  padding: "0.5rem 1.25rem",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.25s ease",
                }}
              >
                Crear cuenta
              </Link>
            </>
          ) : null}

          {/* AUTENTICADO */}
          {status === "authed" && user ? (
            <>
              <StreakIndicator />
              <span
                className="d-none d-md-inline"
                style={{
                  padding: "0.5rem 1rem",
                  background:
                    "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(118, 75, 162, 0.1))",
                  borderRadius: "0.75rem",
                  color: "#667eea",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                👋 Hola, <strong>{user.username}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-sm"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.1))",
                  color: "#dc2626",
                  fontWeight: "600",
                  borderRadius: "0.75rem",
                  border: "2px solid rgba(239, 68, 68, 0.2)",
                  padding: "0.5rem 1rem",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #ef4444 0%, #f87171 100%)";
                  e.target.style.color = "white";
                  e.target.style.borderColor = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.1))";
                  e.target.style.color = "#dc2626";
                  e.target.style.borderColor = "rgba(239, 68, 68, 0.2)";
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
