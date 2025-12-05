// src/modules/ruta/components/RutaPath.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  getLearningPathApi,
  getLearningProgressApi,
} from "@services/api/learningPath.js";
import StepDot from "./StepDot.jsx";
import StepCard from "./StepCard.jsx";
import WeaknessCharts from "@modules/core/components/WeaknessCharts.jsx";

export default function RutaPath() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getLearningPathApi();

        // data debería ser algo tipo:
        // [{ id, title, activity_type: 'THEORY' | 'EXERCISE', step_order, status }, ...]
        // Lo ordenamos por step_order por si acaso.
        const ordered = [...data].sort((a, b) => a.step_order - b.step_order);
        setSteps(ordered);
      } catch (e) {
        console.error(e);
        setError(e.message || "No se pudo cargar la ruta de aprendizaje.");
      } finally {
        setLoading(false);
      }
    })();

    // Scroll al inicio de la página cuando carga el componente
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Cargar progreso y siguiente actividad
  useEffect(() => {
    (async () => {
      try {
        setProgressLoading(true);
        const p = await getLearningProgressApi();
        setProgress(p);
      } catch (e) {
        console.error("Error loading progress:", e);
      } finally {
        setProgressLoading(false);
      }
    })();
  }, []);

  // Scroll automático al paso siguiente cuando se carga el progreso
  useEffect(() => {
    if (
      !loading &&
      !progressLoading &&
      progress?.nextActivity &&
      steps.length > 0 &&
      scrollContainerRef.current
    ) {
      // Encontrar el índice del siguiente paso
      const nextIndex = steps.findIndex(
        (s) => s.id === progress.nextActivity.id
      );
      if (nextIndex !== -1) {
        // Esperar un momento para que el DOM se renderice completamente
        setTimeout(() => {
          const nextElement = scrollContainerRef.current?.querySelector(
            `[data-step-index="${nextIndex}"]`
          );
          if (nextElement) {
            // Scroll dentro del contenedor, no de toda la página
            const container = scrollContainerRef.current;
            const elementTop = nextElement.offsetTop;
            container.scrollTo({ top: elementTop - 20, behavior: "smooth" });
          }
        }, 100);
      }
    }
  }, [loading, progressLoading, progress, steps]);

  // Determinar si un paso está disponible
  const isStepAvailable = (step, index) => {
    // Si está completado, siempre disponible
    if (step.status === "COMPLETED") return true;

    // Si es el primer paso, siempre disponible
    if (index === 0) return true;

    // Si el paso anterior está completado, este está disponible
    if (index > 0 && steps[index - 1].status === "COMPLETED") return true;

    return false;
  };

  const goTo = (step, index) => {
    if (!step) return;

    const stepIndex =
      typeof index === "number"
        ? index
        : steps.findIndex((s) => s.id === step.id);
    if (!isStepAvailable(step, stepIndex)) return;

    if (step.activity_type === "THEORY") {
      navigate(`/teoria/${step.id}`);
    } else if (step.activity_type === "EXERCISE") {
      navigate(`/practica/${step.id}`);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-3">Ruta de aprendizaje</h1>
      <div className="row">
        <div className="col-lg-8">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {loading && <p>Cargando ruta...</p>}

          {!loading && !error && steps.length === 0 && (
            <p>No hay actividades configuradas en la ruta todavía.</p>
          )}

          {!loading && !error && steps.length > 0 && (
            <div
              ref={scrollContainerRef}
              className="d-flex flex-column align-items-center gap-2 mt-4 position-relative"
              style={{
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: "10px",
                scrollBehavior: "smooth",
              }}
            >
              {steps.map((step, index) => {
                const kind =
                  step.activity_type === "THEORY" ? "theory" : "practice";
                const isAvailable = isStepAvailable(step, index);
                const isCompleted = step.status === "COMPLETED";
                const isNext = progress?.nextActivity?.id === step.id;

                // Alternar posición (izquierda/centro/derecha) estilo Duolingo
                const position =
                  index % 3 === 0
                    ? "center"
                    : index % 3 === 1
                    ? "start"
                    : "end";

                return (
                  <div
                    key={step.id}
                    data-step-index={index}
                    className="d-flex flex-column align-items-center position-relative"
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      alignSelf: position,
                    }}
                  >
                    {/* Línea conectora */}
                    {index > 0 && (
                      <div
                        style={{
                          width: "4px",
                          height: "40px",
                          backgroundColor:
                            isCompleted || isAvailable ? "#28a745" : "#dee2e6",
                          marginBottom: "8px",
                          borderRadius: "2px",
                        }}
                      />
                    )}

                    <div
                      className="d-flex align-items-center gap-3 w-100"
                      style={{
                        cursor: isAvailable ? "pointer" : "not-allowed",
                        opacity: isAvailable ? 1 : 0.5,
                        filter: isAvailable ? "none" : "grayscale(100%)",
                      }}
                      onClick={() => goTo(step, index)}
                    >
                      <StepDot
                        kind={kind}
                        isCompleted={isCompleted}
                        isAvailable={isAvailable}
                        isNext={isNext}
                      />
                      <div className="flex-grow-1">
                        <StepCard
                          kind={kind}
                          title={step.title}
                          isCompleted={isCompleted}
                          isAvailable={isAvailable}
                          isNext={isNext}
                          stepOrder={step.step_order}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="card p-3 mb-3">
            <h5>Progreso del curso</h5>
            {progressLoading && <p>Cargando progreso...</p>}
            {!progressLoading && progress && (
              <>
                <div className="mb-2">
                  <div className="progress" style={{ height: 22 }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${progress.percentage}%` }}
                      aria-valuenow={progress.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {progress.percentage}%
                    </div>
                  </div>
                </div>
                <p className="mb-2 text-muted">
                  {progress.completed} de {progress.total} actividades
                  completadas
                </p>

                {progress.nextActivity ? (
                  <div>
                    <p className="mb-1">
                      <strong>Siguiente actividad:</strong>
                    </p>
                    <p className="mb-2">
                      {progress.nextActivity.step_order}.{" "}
                      {progress.nextActivity.title}
                    </p>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          goTo(
                            progress.nextActivity,
                            steps.findIndex(
                              (s) => s.id === progress.nextActivity.id
                            )
                          )
                        }
                      >
                        Ir a la siguiente lección
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-success">
                    ¡Has completado todas las actividades!
                  </p>
                )}
              </>
            )}
            {!progressLoading && !progress && (
              <p>No se pudo cargar el progreso.</p>
            )}
          </div>

          {/* Sección de debilidades */}
          <div className="card p-3">
            <h5 className="mb-3">
              <Link
                to="/debilidades"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Debilidades
              </Link>
            </h5>
            <WeaknessCharts />
          </div>
        </div>
      </div>
    </div>
  );
}
