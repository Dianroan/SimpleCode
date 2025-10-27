import LoginForm from "@modules/auth/organisms/LoginForm.jsx";
import Button from "@ds/atoms/Button.jsx";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const handleLogin = async (payload) => {
    console.log("LOGIN payload", payload);
    alert(`Sesión iniciada para: ${payload.username}`);
  };

  return (
    <main className="container min-vh-100 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-10 col-lg-6">
          <h1 className="mb-2">Iniciar sesión</h1>
          <p className="text-muted mb-4">
            Ingresa tus credenciales para acceder.
          </p>

          {/* Card + link en un mismo flujo vertical */}
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
