// src/modules/auth/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi, meApi } from "@services/api/auth.js"; // 👈 AQUÍ estaba faltando
import { useAuth } from "@context/AuthContext.jsx";
import LoginForm from "@modules/auth/organisms/LoginForm.jsx";
import Button from "@ds/atoms/Button.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // src/modules/auth/pages/LoginPage.jsx
  const handleLogin = async ({ username, password }) => {
    setError("");
    try {
      const { token } = await loginApi({ username, password });

      localStorage.setItem("token", token);

      const { user } = await meApi();

      await login(token, user);

      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError(e.message || "No se pudo iniciar sesión.");
    }
  };

  return (
    <main
      className="d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "calc(100vh - 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Elementos decorativos */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(80px)",
        }}
      />

      <div
        className="container"
        style={{ position: "relative", zIndex: 1, maxWidth: "500px" }}
      >
        <div className="row justify-content-center">
          <div className="col-12">
            <div
              className="animate-fade-in"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "1.5rem",
                padding: "2.5rem",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="text-center mb-4">
                <h1
                  className="mb-2 fw-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontSize: "2rem",
                  }}
                >
                  ¡Bienvenido de vuelta! 👋
                </h1>
                <p className="text-muted">
                  Ingresa tus credenciales para continuar
                </p>
              </div>

              {error && (
                <div
                  className="alert mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.1))",
                    border: "none",
                    borderLeft: "4px solid #ef4444",
                    borderRadius: "0.75rem",
                    color: "#dc2626",
                  }}
                >
                  {error.message || error}
                </div>
              )}

              <div className="d-flex flex-column gap-3">
                <LoginForm onSubmit={handleLogin} />

                <div
                  className="text-center pt-3"
                  style={{ borderTop: "1px solid #e5e7eb" }}
                >
                  <small className="text-muted">¿No tienes cuenta? </small>
                  <Link
                    to="/register"
                    style={{
                      color: "#667eea",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    Crear cuenta aquí
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
