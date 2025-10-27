import RegisterForm from "@modules/auth/organisms/RegisterForm.jsx";
import Button from "@ds/atoms/Button.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerApi, loginApi } from "@services/api/auth.js";

export default function RegisterPage() {
  const nav = useNavigate();
  const [serverError, setServerError] = useState("");
  const [serverOk, setServerOk] = useState("");
  const [serverDetails, setServerDetails] = useState(null); // 👈

  const handleRegister = async ({ username, email, password, confirm }) => {
    setServerError("");
    setServerOk("");
    setServerDetails(null);

    // 👇 confirma lo que estás enviando (abre la consola del navegador)
    console.log("[REGISTER payload]", { username, email, password, confirm });

    try {
      await registerApi({ username, email, password, confirm });
      const { token } = await loginApi({ username, password });
      localStorage.setItem("token", token);
      setServerOk("Cuenta creada. Redirigiendo al panel…");
      nav("/dashboard");
    } catch (e) {
      console.error("[REGISTER error]", e);
      setServerError(e.message || "Error al crear la cuenta.");
      if (e.details) setServerDetails(e.details); // 👈 mostrar detalle zod
    }
  };

  return (
    <main className="container min-vh-100 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-10 col-lg-6">
          <h1 className="mb-2">Crear cuenta</h1>
          <p className="text-muted mb-3">
            Regístrate para comenzar a usar la aplicación.
          </p>

          {serverError && (
            <div className="alert alert-danger">{serverError}</div>
          )}
          {serverDetails && (
            <div className="alert alert-warning">
              <strong>Revisa los campos:</strong>
              <ul className="mb-0">
                {serverDetails.map((d, i) => (
                  <li key={i}>
                    {d.path?.join(".")}: {d.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {serverOk && <div className="alert alert-success">{serverOk}</div>}

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
