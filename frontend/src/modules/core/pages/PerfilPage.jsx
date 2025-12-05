// src/modules/core/pages/PerfilPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@ds/atoms/Card.jsx";
import { useAuth } from "@context/AuthContext.jsx";
import { getLearningProgressApi } from "@services/api/learningPath.js";
import WeaknessChartsHorizontal from "@modules/core/components/WeaknessChartsHorizontal.jsx";

export default function PerfilPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);

  // RQF38: Cargar progreso de la ruta de aprendizaje
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

  const goToNextActivity = () => {
    if (!progress?.nextActivity) return;
    const activity = progress.nextActivity;
    if (activity.activity_type === "THEORY") {
      navigate(`/teoria/${activity.id}`);
    } else if (activity.activity_type === "EXERCISE") {
      navigate(`/practica/${activity.id}`);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Mi Perfil</h1>

      {/* RQF36: Información del usuario (nombre y correo) */}
      <div className="row mb-4">
        <div className="col-md-6">
          <Card className="p-4 h-100">
            <h5 className="mb-3">Información Personal</h5>
            <div className="mb-3">
              <label className="form-label text-muted small">
                Nombre de usuario
              </label>
              <p className="h6">{user?.username || "N/A"}</p>
            </div>
            <div>
              <label className="form-label text-muted small">
                Correo Electrónico
              </label>
              <p className="h6">{user?.email || "N/A"}</p>
            </div>
          </Card>
        </div>

        {/* RQF38: Progreso de la ruta de aprendizaje */}
        <div className="col-md-6">
          <Card className="p-4 h-100">
            <h5 className="mb-3">Progreso en la Ruta</h5>
            {progressLoading && (
              <p className="text-muted">Cargando progreso...</p>
            )}
            {!progressLoading && progress && (
              <>
                <div className="mb-3">
                  <div className="progress" style={{ height: 30 }}>
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
                <p className="mb-3 text-muted">
                  <strong>{progress.completed}</strong> de{" "}
                  <strong>{progress.total}</strong> actividades completadas
                </p>

                {progress.nextActivity ? (
                  <div>
                    <p className="mb-2">
                      <strong>Siguiente actividad:</strong>
                    </p>
                    <p className="mb-3 text-muted">
                      {progress.nextActivity.step_order}.{" "}
                      {progress.nextActivity.title}
                    </p>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={goToNextActivity}
                    >
                      Continuar con la siguiente lección
                    </button>
                  </div>
                ) : (
                  <p className="text-success">
                    ¡Has completado todas las actividades!
                  </p>
                )}
              </>
            )}
            {!progressLoading && !progress && (
              <p className="text-muted">No se pudo cargar el progreso.</p>
            )}
          </Card>
        </div>
      </div>

      {/* Sección de debilidades */}
      <div className="row">
        <div className="col-12">
          <Card className="p-4">
            <h5 className="mb-3">
              <Link
                to="/debilidades"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Debilidades
              </Link>
            </h5>
            <WeaknessChartsHorizontal />
          </Card>
        </div>
      </div>
    </div>
  );
}
