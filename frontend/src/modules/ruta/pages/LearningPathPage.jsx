// frontend/src/pages/LearningPathPage.jsx

import { useEffect, useState } from "react";
import {
  getLearningPath,
  getTheoryActivity,
} from "../../../services/api/learningPath";

export default function LearningPathPage() {
  const [steps, setSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [theory, setTheory] = useState(null);
  const [loadingSteps, setLoadingSteps] = useState(true);
  const [loadingTheory, setLoadingTheory] = useState(false);
  const [error, setError] = useState("");

  // 1) Cargar la ruta desde la BD
  useEffect(() => {
    (async () => {
      try {
        setLoadingSteps(true);
        setError("");
        const data = await getLearningPath();
        setSteps(data);

        if (data.length > 0) {
          // Como pediste: tomar el último que exista
          const lastStep = data[data.length - 1];
          setSelectedStep(lastStep);
        }
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar la ruta de aprendizaje.");
      } finally {
        setLoadingSteps(false);
      }
    })();
  }, []);

  // 2) Cuando cambie el paso seleccionado, si es teoría, cargar teoría desde la BD
  useEffect(() => {
    if (!selectedStep) return;

    if (selectedStep.activity_type === "THEORY") {
      (async () => {
        try {
          setLoadingTheory(true);
          setError("");
          const data = await getTheoryActivity(selectedStep.id);
          setTheory(data);
        } catch (e) {
          console.error(e);
          setError("No se pudo cargar la actividad de teoría.");
          setTheory(null);
        } finally {
          setLoadingTheory(false);
        }
      })();
    } else {
      // Más adelante aquí irá la lógica de ejercicios
      setTheory(null);
    }
  }, [selectedStep]);

  return (
    <div className="container py-4">
      <h1>Ruta de aprendizaje</h1>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      {loadingSteps && <p className="mt-3">Cargando ruta de aprendizaje...</p>}

      {/* Círculos de la ruta, en orden, venidos de la BD */}
      {!loadingSteps && steps.length > 0 && (
        <div className="d-flex gap-3 flex-wrap my-4">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              className={
                "btn rounded-circle d-flex align-items-center justify-content-center " +
                (selectedStep?.id === step.id
                  ? "btn-primary"
                  : "btn-outline-secondary")
              }
              style={{ width: 60, height: 60 }}
              onClick={() => setSelectedStep(step)}
            >
              {step.step_order}
            </button>
          ))}
        </div>
      )}

      {!loadingSteps && steps.length === 0 && (
        <p className="mt-3">No hay actividades en la ruta todavía.</p>
      )}

      {/* Información del paso seleccionado */}
      {selectedStep && (
        <div className="mt-3">
          <h2 className="h4">{selectedStep.title}</h2>
          <p className="text-muted mb-1">
            Tipo:{" "}
            {selectedStep.activity_type === "THEORY" ? "Teoría" : "Ejercicio"}
          </p>
          {selectedStep.description && <p>{selectedStep.description}</p>}
        </div>
      )}

      {/* Contenido de teoría: SOLO lo que viene de la BD */}
      {selectedStep?.activity_type === "THEORY" && (
        <div className="mt-4">
          {loadingTheory && <p>Cargando contenido de teoría...</p>}

          {!loadingTheory && theory && (
            <>
              <h3 className="h5 mb-3">{theory.title}</h3>
              {/* Por ahora mostramos solo el content en texto plano.
                  Más adelante podemos formatear mejor o usar markdown/HTML. */}
              <p style={{ whiteSpace: "pre-wrap" }}>{theory.content}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
