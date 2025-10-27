import RegisterForm from "@modules/auth/organisms/RegisterForm.jsx";
import Button from "@ds/atoms/Button.jsx";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const handleRegister = async (payload) => {
    console.log("REGISTER payload", payload);
    alert(`Cuenta creada para: ${payload.username}`);
  };

  return (
    <main className="container min-vh-100 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-10 col-lg-6">
          <h1 className="mb-2">Simple code</h1>
          <p className="text-muted mb-4">
            Regístrate para comenzar a usar la aplicación.
          </p>

          {/* Card + link en el mismo bloque */}
          <div className="d-flex flex-column gap-3">
            <RegisterForm onSubmit={handleRegister} />

            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">¿Ya tienes cuenta?</small>
              <Link to="/login">
                <Button variant="outline-primary" className="btn btn-sm">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
