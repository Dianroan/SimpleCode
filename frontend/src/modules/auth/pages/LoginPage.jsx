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

  const handleLogin = async ({ username, password }) => {
    setError("");
    try {
      const { token } = await loginApi({ username, password });
      const me = await meApi();    // 👈 pedimos el usuario
      await login(token, me);      // 👈 lo metemos al contexto
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError(e.message || "No se pudo iniciar sesión.");
    }
  };

  return (
    <main className="container min-vh-100 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-10 col-lg-6">
          <h1 className="mb-2">Iniciar sesión</h1>
          <p className="text-muted mb-3">Ingresa tus credenciales para acceder.</p>

          {error && <div className="alert alert-danger">{error.message || error}</div>}

          <div className="d-flex flex-column gap-3">
            <LoginForm onSubmit={handleLogin} />

            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">¿No tienes cuenta?</small>
              <Link to="/register">
                <Button variant="outline-primary" className="btn btn-sm">
                  Crear cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
