/**
 * Página PerfilPage - Perfil del usuario
 *
 * Muestra:
 * - Avatar con inicial del usuario
 * - Nombre de usuario y email
 * - Estadísticas de progreso (actividades completadas, total, porcentaje)
 * - Racha actual con indicador visual
 * - Botón "Continuar aprendiendo" (va a la siguiente actividad)
 * - Gráficas de debilidades horizontales
 *
 * Carga en paralelo: progreso de ruta y racha actual
 */

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
    <div className="container-fluid p-4 animate-fade-in">
      {/* Header del perfil */}
      <div className="mb-5">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || "👤"}
          </div>
          <div>
            <h1
              className="mb-1 fw-bold"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "2.5rem",
              }}
            >
              Mi Perfil
            </h1>
            <p className="text-muted mb-0">
              Bienvenido de vuelta, {user?.username}!
            </p>
          </div>
        </div>
      </div>

      {/* Grid principal */}
      <div className="row g-4 mb-4">
        {/* Información Personal */}
        <div className="col-12 col-lg-4">
          <div
            className="card hover-lift h-100"
            style={{
              borderRadius: "1.5rem",
              border: "none",
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
              borderLeft: "5px solid #667eea",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-4">
              <span style={{ fontSize: "1.75rem" }}>👤</span>
              <h5 className="fw-bold mb-0" style={{ color: "#667eea" }}>
                Información Personal
              </h5>
            </div>

            <div className="mb-4">
              <label
                className="text-muted small mb-1 d-block"
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Nombre de usuario
              </label>
              <p className="h5 mb-0 fw-semibold" style={{ color: "#1f2937" }}>
                {user?.username || "N/A"}
              </p>
            </div>

            <div>
              <label
                className="text-muted small mb-1 d-block"
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Correo Electrónico
              </label>
              <p className="h6 mb-0" style={{ color: "#6b7280" }}>
                {user?.email || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Racha de Aprendizaje */}
        <div className="col-12 col-lg-4">
          <div
            className="card hover-lift h-100"
            style={{
              borderRadius: "1.5rem",
              border: "none",
              background:
                "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)",
              borderLeft: "5px solid #f59e0b",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-4">
              <span style={{ fontSize: "1.75rem" }}>🔥</span>
              <h5 className="fw-bold mb-0" style={{ color: "#f59e0b" }}>
                Racha de Aprendizaje
              </h5>
            </div>

            {streakLoading ? (
              <div className="text-center py-3">
                <div
                  className="spinner"
                  style={{ width: "30px", height: "30px", borderWidth: "3px" }}
                />
              </div>
            ) : (
              <>
                <div
                  className="text-center mb-4 p-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                    borderRadius: "1rem",
                    boxShadow: "0 8px 20px rgba(245, 158, 11, 0.3)",
                  }}
                >
                  <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>
                    {streak?.is_active_today ? "🔥" : "⚪"}
                  </div>
                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "800",
                      color: "white",
                      lineHeight: 1,
                    }}
                  >
                    {streak?.current_streak_days || 0}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: "600",
                    }}
                  >
                    {streak?.current_streak_days === 1 ? "día" : "días"}{" "}
                    consecutivos
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted small">Estado de hoy</span>
                  {streak?.is_active_today ? (
                    <span
                      className="badge"
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #22d3ee 100%)",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "50px",
                        fontWeight: "600",
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      ✓ Activada
                    </span>
                  ) : (
                    <span
                      className="badge"
                      style={{
                        background: "#e5e7eb",
                        color: "#6b7280",
                        padding: "0.5rem 1rem",
                        borderRadius: "50px",
                        fontWeight: "600",
                      }}
                    >
                      Pendiente
                    </span>
                  )}
                </div>

                {streak?.streak_start_date &&
                  streak.current_streak_days > 0 && (
                    <div
                      className="text-center small text-muted mt-3 pt-3"
                      style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}
                    >
                      Iniciaste esta racha el{" "}
                      {new Date(
                        streak.streak_start_date + "T00:00:00"
                      ).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                      })}
                    </div>
                  )}
              </>
            )}
          </div>
        </div>

        {/* Progreso en la Ruta */}
        <div className="col-12 col-lg-4">
          <div
            className="card hover-lift h-100"
            style={{
              borderRadius: "1.5rem",
              border: "none",
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(34, 211, 238, 0.05) 100%)",
              borderLeft: "5px solid #10b981",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-4">
              <span style={{ fontSize: "1.75rem" }}>📈</span>
              <h5 className="fw-bold mb-0" style={{ color: "#10b981" }}>
                Progreso en la Ruta
              </h5>
            </div>

            {progressLoading ? (
              <div className="text-center py-3">
                <div
                  className="spinner"
                  style={{ width: "30px", height: "30px", borderWidth: "3px" }}
                />
              </div>
            ) : progress ? (
              <>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Completado</span>
                    <span
                      className="fw-bold"
                      style={{ fontSize: "1.25rem", color: "#10b981" }}
                    >
                      {progress.percentage}%
                    </span>
                  </div>
                  <div
                    className="progress"
                    style={{
                      height: "12px",
                      borderRadius: "50px",
                      background: "rgba(16, 185, 129, 0.1)",
                    }}
                  >
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${progress.percentage}%`,
                        background:
                          "linear-gradient(90deg, #10b981 0%, #22d3ee 100%)",
                        borderRadius: "50px",
                        transition: "width 1s ease",
                      }}
                      aria-valuenow={progress.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>

                <div
                  className="mb-4 text-center p-3"
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    borderRadius: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#10b981",
                    }}
                  >
                    {progress.completed}{" "}
                    <span style={{ fontSize: "1rem", color: "#6b7280" }}>
                      / {progress.total}
                    </span>
                  </div>
                  <div className="small text-muted">
                    actividades completadas
                  </div>
                </div>

                {progress.nextActivity ? (
                  <div>
                    <p className="small text-muted mb-2">
                      SIGUIENTE ACTIVIDAD:
                    </p>
                    <p
                      className="fw-semibold mb-3"
                      style={{ color: "#1f2937", fontSize: "0.95rem" }}
                    >
                      {progress.nextActivity.step_order}.{" "}
                      {progress.nextActivity.title}
                    </p>
                    <button
                      className="btn w-100"
                      onClick={goToNextActivity}
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #22d3ee 100%)",
                        color: "white",
                        fontWeight: "600",
                        borderRadius: "0.75rem",
                        padding: "0.75rem",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                        transition: "all 0.25s ease",
                      }}
                    >
                      🚀 Continuar aprendiendo
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-center p-3"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 211, 238, 0.1))",
                      borderRadius: "0.75rem",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                      🎉
                    </div>
                    <p
                      className="fw-semibold mb-0"
                      style={{ color: "#10b981" }}
                    >
                      ¡Has completado todas las actividades!
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted text-center">
                No se pudo cargar el progreso.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sección de debilidades */}
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              borderRadius: "1.5rem",
              border: "none",
              background: "white",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "1.75rem" }}>📊</span>
                <h5 className="fw-bold mb-0" style={{ color: "#ec4899" }}>
                  Tus Debilidades
                </h5>
              </div>
              <Link
                to="/debilidades"
                style={{
                  textDecoration: "none",
                  color: "#ec4899",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
                className="hover-grow"
              >
                Ver detalles →
              </Link>
            </div>
            <WeaknessChartsHorizontal />
          </div>
        </div>
      </div>
    </div>
  );
}
