// src/modules/core/pages/PerfilPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@ds/atoms/Card.jsx";
import { useAuth } from "@context/AuthContext.jsx";
import { getLearningProgressApi } from "@services/api/learningPath.js";
import { getCurrentStreakApi } from "@services/api/streaks.js";
import WeaknessChartsHorizontal from "@modules/core/components/WeaknessChartsHorizontal.jsx";

export default function PerfilPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [streak, setStreak] = useState(null);
  const [streakLoading, setStreakLoading] = useState(true);

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

  // Cargar racha del usuario
  useEffect(() => {
    (async () => {
      try {
        setStreakLoading(true);
        const s = await getCurrentStreakApi();
        setStreak(s);
      } catch (e) {
        console.error("Error loading streak:", e);
      } finally {
        setStreakLoading(false);
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

            {/* Nombre y Correo en una sola fila */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label text-muted small">
                  Nombre de usuario
                </label>
                <p className="h6 mb-0">{user?.username || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small">
                  Correo Electrónico
                </label>
                <p className="h6 mb-0">{user?.email || "N/A"}</p>
              </div>
            </div>

            {/* Información de Racha */}
            <hr />
            <h6 className="mb-3 mt-3">Racha de Aprendizaje 🔥</h6>
            {streakLoading ? (
              <p className="text-muted small">Cargando racha...</p>
            ) : (
              <>
                {/* Racha y Estado en una fila */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small">
                      Días consecutivos
                    </label>
                    <p className="h6 mb-0">
                      <span style={{ fontSize: "28px", marginRight: "8px" }}>
                        {streak?.is_active_today ? "🔥" : "⚪"}
                      </span>
                      <strong style={{ fontSize: "24px" }}>
                        {streak?.current_streak_days || 0}
                      </strong>{" "}
                      {streak?.current_streak_days === 1 ? "día" : "días"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">
                      Estado de hoy
                    </label>
                    <p className="h6 mb-0">
                      {streak?.is_active_today ? (
                        <span className="badge bg-success">✓ Activada</span>
                      ) : (
                        <span className="badge bg-secondary">Pendiente</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Fechas de racha en una fila */}
                {(streak.is_active_today ||
                  (streak.streak_start_date &&
                    streak.current_streak_days > 0)) && (
                  <div className="row">
                    {streak.streak_start_date &&
                      streak.current_streak_days > 0 && (
                        <div className="col-md-6">
                          <label className="form-label text-muted small">
                            Inicio de racha
                          </label>
                          <p className="h6 mb-0 small">
                            {new Date(
                              streak.streak_start_date + "T00:00:00"
                            ).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      )}
                    {streak.is_active_today && (
                      <div className="col-md-6">
                        <label className="form-label text-muted small">
                          Última actividad
                        </label>
                        <p className="h6 mb-0 small">
                          {new Date(
                            streak.last_activity_date + "T00:00:00"
                          ).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
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
