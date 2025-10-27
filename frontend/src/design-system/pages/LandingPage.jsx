import { Link } from "react-router-dom";
import Button from "@ds/atoms/Button.jsx";

export default function LandingPage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-light">
        <div className="container py-5 py-lg-6">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <h1 className="display-5 fw-bold mb-3">
                Aprende Programación Orientada a Objetos con C# desde cero.
              </h1>
              <p className="lead text-muted mb-4">
                SimpleCode combina una ruta de aprendizaje guiada con teoría,
                ejercicios prácticos y retos de la comunidad. Recibe
                retroalimentación, detecta tus puntos débiles y progresa a tu
                ritmo.
              </p>
              <div className="d-flex gap-2">
                <Link to="/login">
                  <Button>Iniciar sesión</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline-primary" className="btn">
                    Crear cuenta
                  </Button>
                </Link>
              </div>
              <small className="text-muted d-block mt-2">
                ¿Nuevo aquí? Empieza gratis en minutos.
              </small>
            </div>

            <div className="col-12 col-lg-6">
              {/* Visual placeholder: reemplázalo por una imagen/mockup */}
              <div className="ratio ratio-16x9 rounded-3 shadow-sm bg-white d-flex align-items-center justify-content-center">
                <div className="text-center p-4">
                  <div className="fw-semibold mb-2">Vista previa</div>
                  <div className="text-muted">En proceso.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES PRINCIPALES */}
      <section>
        <div className="container py-5">
          <h2 className="h3 text-center mb-4">
            Todo lo que necesitas para aprender C# con POO
          </h2>
          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5">Ruta de aprendizaje</h3>
                  <p className="text-muted mb-0">
                    Avanza por una secuencia clara de actividades con dificultad
                    gradual.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5">Teoría + práctica</h3>
                  <p className="text-muted mb-0">
                    Contenido teórico y ejercicios; escribe código en el
                    navegador con Ace Editor y ejecútalo vía JDoodle.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5">Detección de debilidades</h3>
                  <p className="text-muted mb-0">
                    Identifica áreas a reforzar a partir de etiquetas y
                    resultados en tus ejercicios.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5">Desafíos de la comunidad</h3>
                  <p className="text-muted mb-0">
                    Explora, crea y califica retos. Practica con problemas
                    reales de otros usuarios.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5">Racha y progreso</h3>
                  <p className="text-muted mb-0">
                    Mantén tu streak activo y monitorea tu avance con
                    visualizaciones.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5">Perfil del usuario</h3>
                  <p className="text-muted mb-0">
                    Revisa tu historial, debilidades y accesos rápidos a tus
                    módulos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/register">
              <Button variant="success">Comenzar ahora</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-light">
        <div className="container py-5">
          <h2 className="h3 text-center mb-4">¿Cómo funciona SimpleCode?</h2>
          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <span className="badge bg-primary mb-2">1</span>
                  <h3 className="h6">Crea tu cuenta</h3>
                  <p className="text-muted mb-0">
                    Regístrate con usuario, correo y contraseña para guardar tu
                    progreso.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <span className="badge bg-primary mb-2">2</span>
                  <h3 className="h6">Sigue la ruta</h3>
                  <p className="text-muted mb-0">
                    Alterna entre teoría y ejercicios. Escribe código y
                    ejecútalo con casos de prueba.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <span className="badge bg-primary mb-2">3</span>
                  <h3 className="h6">Refuerza y mejora</h3>
                  <p className="text-muted mb-0">
                    Revisa tus debilidades y practica con desafíos de la
                    comunidad relacionados.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <div className="d-flex gap-2 justify-content-center">
              <Link to="/login">
                <Button>Iniciar sesión</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline-primary" className="btn">
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
