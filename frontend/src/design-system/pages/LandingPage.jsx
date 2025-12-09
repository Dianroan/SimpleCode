/**
 * Página LandingPage - Página de inicio pública
 *
 * Página principal para visitantes no autenticados con:
 * - Hero section: Título, descripción y botones de CTA
 * - Sección de características principales
 * - Sección "Cómo funciona" con pasos visuales
 * - Sección de beneficios
 * - Call to action final
 *
 * Elementos decorativos animados y gradientes vibrantes en toda la página
 */

import { Link } from "react-router-dom";
import Button from "@ds/atoms/Button.jsx";

export default function LandingPage() {
  return (
    <main
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Elementos decorativos de fondo */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            filter: "blur(60px)",
          }}
        />

        <div
          className="container py-5 py-lg-6"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6 animate-slide-in-left">
              <h1
                className="display-4 fw-bold mb-3"
                style={{
                  color: "white",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                Aprende Programación Orientada a Objetos con C# desde cero 🚀
              </h1>
              <p
                className="lead mb-4"
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "1.15rem",
                }}
              >
                SimpleCode combina una ruta de aprendizaje guiada con teoría,
                ejercicios prácticos y retos de la comunidad. Recibe
                retroalimentación, detecta tus puntos débiles y progresa a tu
                ritmo.
              </p>
              <div className="d-flex gap-3">
                <Link to="/login">
                  <Button
                    style={{
                      background: "white",
                      color: "#667eea",
                      fontWeight: "700",
                      padding: "0.875rem 2rem",
                      fontSize: "1.05rem",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="outline-primary"
                    className="btn"
                    style={{
                      background: "transparent",
                      color: "white",
                      border: "2px solid white",
                      fontWeight: "700",
                      padding: "0.875rem 2rem",
                      fontSize: "1.05rem",
                    }}
                  >
                    Crear cuenta
                  </Button>
                </Link>
              </div>
              <small
                className="d-block mt-3"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                ✨ ¿Nuevo aquí? Empieza gratis en minutos.
              </small>
            </div>

            <div className="col-12 col-lg-6 animate-slide-in-right">
              {/* Vista previa de la plataforma */}
              <div
                className="rounded-4 overflow-hidden hover-lift"
                style={{
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
                  border: "4px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <img
                  src="/VistaPrevia.jpeg"
                  alt="Vista previa de SimpleCode"
                  className="w-100 h-auto"
                  style={{ display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES PRINCIPALES */}
      <section className="py-5">
        <div className="container py-4">
          <h2
            className="h2 text-center mb-2 fw-bold"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Todo lo que necesitas para aprender C# con POO
          </h2>
          <p className="text-center text-muted mb-5">
            Herramientas poderosas para tu éxito
          </p>

          <div className="row g-4 animate-fade-in">
            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 hover-lift"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                  borderLeft: "4px solid #667eea",
                }}
              >
                <div className="card-body p-4">
                  <div
                    className="mb-3"
                    style={{
                      fontSize: "2.5rem",
                      filter: "drop-shadow(0 4px 6px rgba(102, 126, 234, 0.3))",
                    }}
                  >
                    🎯
                  </div>
                  <h3 className="h5 fw-bold" style={{ color: "#667eea" }}>
                    Ruta de aprendizaje
                  </h3>
                  <p className="text-muted mb-0">
                    Avanza por una secuencia clara de actividades con dificultad
                    gradual.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 hover-lift"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background:
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(34, 211, 238, 0.05) 100%)",
                  borderLeft: "4px solid #10b981",
                }}
              >
                <div className="card-body p-4">
                  <div
                    className="mb-3"
                    style={{
                      fontSize: "2.5rem",
                      filter: "drop-shadow(0 4px 6px rgba(16, 185, 129, 0.3))",
                    }}
                  >
                    💻
                  </div>
                  <h3 className="h5 fw-bold" style={{ color: "#10b981" }}>
                    Teoría + práctica
                  </h3>
                  <p className="text-muted mb-0">
                    Contenido teórico y ejercicios; escribe código en el
                    navegador con Ace Editor y ejecútalo vía JDoodle.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 hover-lift"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background:
                    "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)",
                  borderLeft: "4px solid #f59e0b",
                }}
              >
                <div className="card-body p-4">
                  <div
                    className="mb-3"
                    style={{
                      fontSize: "2.5rem",
                      filter: "drop-shadow(0 4px 6px rgba(245, 158, 11, 0.3))",
                    }}
                  >
                    📊
                  </div>
                  <h3 className="h5 fw-bold" style={{ color: "#f59e0b" }}>
                    Detección de debilidades
                  </h3>
                  <p className="text-muted mb-0">
                    Identifica áreas a reforzar a partir de etiquetas y
                    resultados en tus ejercicios.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 hover-lift"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background:
                    "linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(219, 39, 119, 0.05) 100%)",
                  borderLeft: "4px solid #ec4899",
                }}
              >
                <div className="card-body p-4">
                  <div
                    className="mb-3"
                    style={{
                      fontSize: "2.5rem",
                      filter: "drop-shadow(0 4px 6px rgba(236, 72, 153, 0.3))",
                    }}
                  >
                    🏆
                  </div>
                  <h3 className="h5 fw-bold" style={{ color: "#ec4899" }}>
                    Desafíos de la comunidad
                  </h3>
                  <p className="text-muted mb-0">
                    Explora, crea y califica retos. Practica con problemas
                    reales de otros usuarios.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 hover-lift"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background:
                    "linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)",
                  borderLeft: "4px solid #06b6d4",
                }}
              >
                <div className="card-body p-4">
                  <div
                    className="mb-3"
                    style={{
                      fontSize: "2.5rem",
                      filter: "drop-shadow(0 4px 6px rgba(6, 182, 212, 0.3))",
                    }}
                  >
                    🔥
                  </div>
                  <h3 className="h5 fw-bold" style={{ color: "#06b6d4" }}>
                    Racha y progreso
                  </h3>
                  <p className="text-muted mb-0">
                    Mantén tu streak activo y monitorea tu avance con
                    visualizaciones.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 hover-lift"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)",
                  borderLeft: "4px solid #8b5cf6",
                }}
              >
                <div className="card-body p-4">
                  <div
                    className="mb-3"
                    style={{
                      fontSize: "2.5rem",
                      filter: "drop-shadow(0 4px 6px rgba(139, 92, 246, 0.3))",
                    }}
                  >
                    👤
                  </div>
                  <h3 className="h5 fw-bold" style={{ color: "#8b5cf6" }}>
                    Perfil del usuario
                  </h3>
                  <p className="text-muted mb-0">
                    Revisa tu historial, debilidades y accesos rápidos a tus
                    módulos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/register">
              <Button
                gradient
                style={{
                  padding: "0.875rem 2.5rem",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                }}
              >
                🚀 Comenzar ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #e0e7ff 0%, #fae8ff 100%)",
        }}
      >
        <div className="container py-4">
          <h2
            className="h2 text-center mb-2 fw-bold"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ¿Cómo funciona SimpleCode?
          </h2>
          <p className="text-center text-muted mb-5">
            Tres pasos simples para empezar
          </p>

          <div className="row g-4">
            <div className="col-12 col-lg-4 animate-fade-in">
              <div
                className="card h-100 hover-lift"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background: "white",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.15)",
                }}
              >
                <div className="card-body p-4 text-center">
                  <div
                    className="mx-auto mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.75rem",
                      fontWeight: "bold",
                      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                    }}
                  >
                    1
                  </div>
                  <h3 className="h5 fw-bold mb-2">Crea tu cuenta</h3>
                  <p className="text-muted mb-0">
                    Regístrate con usuario, correo y contraseña para guardar tu
                    progreso.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-12 col-lg-4 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div
                className="card h-100 hover-lift"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background: "white",
                  boxShadow: "0 10px 30px rgba(16, 185, 129, 0.15)",
                }}
              >
                <div className="card-body p-4 text-center">
                  <div
                    className="mx-auto mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #10b981 0%, #22d3ee 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.75rem",
                      fontWeight: "bold",
                      boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    2
                  </div>
                  <h3 className="h5 fw-bold mb-2">Sigue la ruta</h3>
                  <p className="text-muted mb-0">
                    Alterna entre teoría y ejercicios. Escribe código y
                    ejecútalo con casos de prueba.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-12 col-lg-4 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div
                className="card h-100 hover-lift"
                style={{
                  borderRadius: "1.5rem",
                  border: "none",
                  background: "white",
                  boxShadow: "0 10px 30px rgba(236, 72, 153, 0.15)",
                }}
              >
                <div className="card-body p-4 text-center">
                  <div
                    className="mx-auto mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.75rem",
                      fontWeight: "bold",
                      boxShadow: "0 8px 20px rgba(236, 72, 153, 0.4)",
                    }}
                  >
                    3
                  </div>
                  <h3 className="h5 fw-bold mb-2">Refuerza y mejora</h3>
                  <p className="text-muted mb-0">
                    Revisa tus debilidades y practica con desafíos de la
                    comunidad relacionados.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/login">
                <Button
                  gradient
                  style={{
                    padding: "0.875rem 2rem",
                    fontSize: "1.05rem",
                  }}
                >
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  style={{
                    padding: "0.875rem 2rem",
                    fontSize: "1.05rem",
                    background: "white",
                    color: "#667eea",
                    fontWeight: "700",
                    border: "2px solid #667eea",
                  }}
                >
                  Crear cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
