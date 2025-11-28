// src/modules/core/pages/PerfilPage.jsx
import { useEffect, useState } from "react";
import Card from "@ds/atoms/Card.jsx";
import { useAuth } from "@context/AuthContext.jsx";
import { getLearningProgressApi } from "@services/api/learningPath.js";

export default function PerfilPage() {
  const { user } = useAuth();
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

  return (
    <div className="container py-4">
      <h1 className="mb-4">Mi Perfil</h1>

      {/* RQF36: Información del usuario (nombre y correo) */}
      <div className="row mb-4">
        <div className="col-md-6">
          <Card className="p-4 h-100">
            <h5 className="mb-3">Información Personal</h5>
            <div className="mb-3">
              <label className="form-label text-muted small">Nombre de usuario</label>
              <p className="h6">{user?.username || "N/A"}</p>
            </div>
            <div>
              <label className="form-label text-muted small">Correo Electrónico</label>
              <p className="h6">{user?.email || "N/A"}</p>
            </div>
          </Card>
        </div>

        {/* RQF38: Progreso de la ruta de aprendizaje */}
        <div className="col-md-6">
          <Card className="p-4 h-100">
            <h5 className="mb-3">Progreso en la Ruta</h5>
            {progressLoading && <p className="text-muted">Cargando progreso...</p>}
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
                <p className="mb-0 text-muted">
                  <strong>{progress.completed}</strong> de <strong>{progress.total}</strong> actividades completadas
                </p>
              </>
            )}
            {!progressLoading && !progress && (
              <p className="text-muted">No se pudo cargar el progreso.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
