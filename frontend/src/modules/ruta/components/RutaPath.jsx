// src/modules/ruta/components/RutaPath.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getLearningPathApi } from "@services/api/learningPath.js";
import StepDot from "./StepDot.jsx";
import StepCard from "./StepCard.jsx";

export default function RutaPath() {
  const navigate = useNavigate();

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  );
}
