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
    <main
      className="d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
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
                      "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontSize: "2rem",
                  }}
                >
                  Únete a SimpleCode 🚀
                </h1>
                <p className="text-muted">
                  Crea tu cuenta y empieza a aprender
                </p>
              </div>

              {serverError && (
                <div
                  className="alert mb-3"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.1))",
                    border: "none",
                    borderLeft: "4px solid #ef4444",
                    borderRadius: "0.75rem",
                    color: "#dc2626",
                  }}
                >
                  {serverError}
                </div>
              )}
              {serverDetails && (
                <div
                  className="alert mb-3"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))",
                    border: "none",
                    borderLeft: "4px solid #f59e0b",
                    borderRadius: "0.75rem",
                    color: "#d97706",
                  }}
                >
                  <strong>Revisa los campos:</strong>
                  <ul className="mb-0 mt-2">
                    {serverDetails.map((d, i) => (
                      <li key={i}>
                        {d.path?.join(".")}: {d.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {serverOk && (
                <div
                  className="alert mb-3"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1))",
                    border: "none",
                    borderLeft: "4px solid #10b981",
                    borderRadius: "0.75rem",
                    color: "#059669",
                  }}
                >
                  {serverOk}
                </div>
              )}

              <div className="d-flex flex-column gap-3">
                <RegisterForm onSubmit={handleRegister} />

                <div
                  className="text-center pt-3"
                  style={{ borderTop: "1px solid #e5e7eb" }}
                >
                  <small className="text-muted">¿Ya tienes cuenta? </small>
                  <Link
                    to="/login"
                    style={{
                      color: "#ec4899",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    Inicia sesión aquí
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
