/**
 * Componente StreakIndicator - Indicador de racha de aprendizaje
 *
 * Muestra la racha actual del usuario:
 * - Icono de fuego 🔥 a color si la racha está activa hoy
 * - Icono en escala de grises si no está activa
 * - Número de días consecutivos
 *
 * Se recarga automáticamente al cambiar de ruta (por si el usuario completó una actividad)
 */

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCurrentStreakApi } from "@services/api/streaks";

export default function StreakIndicator() {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadStreak();
  }, []);

  // Recargar racha cuando cambia la ruta (por si completó una actividad)
  useEffect(() => {
    loadStreak();
  }, [location.pathname]);

  const loadStreak = async () => {
    try {
      const data = await getCurrentStreakApi();
      setStreak(data);
    } catch (error) {
      console.error("Error loading streak:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  const isActive = streak?.is_active_today;
  const days = streak?.current_streak_days || 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "20px",
        backgroundColor: isActive ? "#fff3cd" : "#f8f9fa",
        border: `1px solid ${isActive ? "#ffc107" : "#dee2e6"}`,
      }}
      title={
        isActive
          ? `Racha activa: ${days} ${days === 1 ? "día" : "días"}`
          : `Racha actual: ${days} ${
              days === 1 ? "día" : "días"
            }. Completa una actividad hoy para activarla.`
      }
    >
      <span
        style={{
          fontSize: "18px",
          filter: isActive ? "none" : "grayscale(80%) opacity(0.5)",
        }}
      >
        🔥
      </span>
      <span
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: isActive ? "#856404" : "#6c757d",
        }}
      >
        {days}
      </span>
    </div>
  );
}
