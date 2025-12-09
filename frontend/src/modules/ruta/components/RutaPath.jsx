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
    <div className="container py-4 animate-fade-in">
      <div className="mb-4">
        <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem" }}>
          <span style={{ marginRight: "0.5rem" }}>🎯</span>
          <span
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ruta de aprendizaje
          </span>
        </h1>
        <p className="text-muted">
          Sigue tu camino hacia el dominio de C# y POO
        </p>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {error && (
            <div
              className="alert"
              role="alert"
              style={{
                background:
                  "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.1))",
                border: "none",
                borderLeft: "4px solid #ef4444",
                borderRadius: "1rem",
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-5">
              <div className="spinner mx-auto mb-3" />
              <p className="text-muted">Cargando tu ruta de aprendizaje...</p>
            </div>
          )}

          {!loading && !error && steps.length === 0 && (
            <div
              className="text-center py-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(118, 75, 162, 0.05))",
                borderRadius: "1rem",
                padding: "3rem",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
              <p className="text-muted">
                No hay actividades configuradas en la ruta todavía.
              </p>
            </div>
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
                          width: "5px",
                          height: "40px",
                          background:
                            isCompleted || isAvailable
                              ? "linear-gradient(180deg, #10b981 0%, #22d3ee 100%)"
                              : "#e5e7eb",
                          marginBottom: "12px",
                          borderRadius: "3px",
                          boxShadow:
                            isCompleted || isAvailable
                              ? "0 2px 8px rgba(16, 185, 129, 0.3)"
                              : "none",
                        }}
                      />
                    )}

                    <div
                      className="d-flex align-items-center gap-3 w-100 hover-lift"
                      style={{
                        cursor: isAvailable ? "pointer" : "not-allowed",
                        opacity: isAvailable ? 1 : 0.6,
                        filter: isAvailable ? "none" : "grayscale(50%)",
                        transition: "all 0.25s ease",
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
          <div 
            className="card hover-lift mb-3" 
            style={{
              borderRadius: '1.5rem',
              border: 'none',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(34, 211, 238, 0.05) 100%)',
              borderLeft: '5px solid #10b981',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <span style={{ fontSize: '1.5rem' }}>📈</span>
              <h5 className="fw-bold mb-0" style={{ color: '#10b981' }}>
                Progreso del Curso
              </h5>
            </div>

            {progressLoading && (
              <div className="text-center py-3">
                <div className="spinner mx-auto" style={{ width: '30px', height: '30px', borderWidth: '3px' }} />
              </div>
            )}

            {!progressLoading && progress && (
              <>
                <div className="mb-3">
                  <div 
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <span className="text-muted small">Completado</span>
                    <span className="fw-bold" style={{ fontSize: '1.25rem', color: '#10b981' }}>
                      {progress.percentage}%
                    </span>
                  </div>
                  <div 
                    className="progress" 
                    style={{ 
                      height: '12px',
                      borderRadius: '50px',
                      background: 'rgba(16, 185, 129, 0.1)',
                    }}
                  >
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ 
                        width: `${progress.percentage}%`,
                        background: 'linear-gradient(90deg, #10b981 0%, #22d3ee 100%)',
                        borderRadius: '50px',
                        transition: 'width 1s ease',
                      }}
                      aria-valuenow={progress.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>

                <div className="mb-3 text-center p-3" style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.75rem' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981' }}>
                    {progress.completed} <span style={{ fontSize: '1rem', color: '#6b7280' }}>/ {progress.total}</span>
                  </div>
                  <div className="small text-muted">actividades completadas</div>
                </div>

                {progress.nextActivity ? (
                  <div>
                    <p className="small text-muted mb-2">SIGUIENTE ACTIVIDAD:</p>
                    <p className="fw-semibold mb-3" style={{ color: '#1f2937', fontSize: '0.9rem' }}>
                      {progress.nextActivity.step_order}. {progress.nextActivity.title}
                    </p>
                    <button
                      className="btn w-100"
                      onClick={() =>
                        goTo(
                          progress.nextActivity,
                          steps.findIndex(
                            (s) => s.id === progress.nextActivity.id
                          )
                        )
                      }
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #22d3ee 100%)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '0.75rem',
                        padding: '0.75rem',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      🚀 Continuar
                    </button>
                  </div>
                ) : (
                  <div 
                    className="text-center p-3" 
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 211, 238, 0.1))',
                      borderRadius: '0.75rem',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
                    <p className="fw-semibold mb-0" style={{ color: '#10b981' }}>
                      ¡Completaste todo!
                    </p>
                  </div>
                )}
              </>
            )}
            {!progressLoading && !progress && (
              <p className="text-muted text-center">No se pudo cargar el progreso.</p>
            )}
          </div>

          {/* Sección de debilidades */}
          <div 
            className="card hover-lift" 
            style={{
              borderRadius: '1.5rem',
              border: 'none',
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              borderLeft: '5px solid #ec4899',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.5rem' }}>📊</span>
                <h5 className="fw-bold mb-0" style={{ color: '#ec4899' }}>
                  Debilidades
                </h5>
              </div>
              <Link
                to="/debilidades"
                style={{ 
                  textDecoration: 'none',
                  color: '#ec4899',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                }}
                className="hover-grow"
              >
                Ver más →
              </Link>
            </div>
            <WeaknessCharts />
          </div>
        </div>
      </div>
    </div>
  );
}
