// src/modules/ruta/components/RutaPath.jsx
import { useEffect, useState } from "react";
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

  const goTo = (step) => {
    if (!step) return;
    if (step.activity_type === "THEORY") {
      navigate(`/teoria/${step.id}`);
    } else if (step.activity_type === "EXERCISE") {
      navigate(`/practica/${step.id}`);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-3">Ruta de aprendizaje</h1>
      <p className="text-muted mb-4">
        Estos pasos vienen directamente de la base de datos (tabla{" "}
        <code>courses</code>).
      </p>

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
            <div className="d-flex flex-column gap-3 mt-3">
              {steps.map((step, index) => {
                const kind =
                  step.activity_type === "THEORY" ? "theory" : "practice";

                return (
                  <div
                    key={step.id}
                    className="d-flex align-items-center gap-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => goTo(step)}
                  >
                    <StepDot kind={kind} />
                    <div className="flex-grow-1">
                      <StepCard kind={kind} title={step.title} />
                    </div>
                    <small className="text-muted">
                      Paso {step.step_order}
                      {step.status === "COMPLETED" && " · Completado"}
                      {step.status === "IN_PROGRESS" && " · En progreso"}
                    </small>
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
                        onClick={() => goTo(progress.nextActivity)}
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
