/**
 * Servicios de API para rachas de días consecutivos
 * 
 * Endpoints:
 * - GET /api/streaks/current - Obtener racha actual
 * - POST /api/streaks/update - Actualizar racha al completar actividad
 */

import { request } from "./http";

/**
 * Obtener la racha actual del usuario
 * @returns {Promise<{current_streak_days: number, longest_streak: number, is_active_today: boolean}>}
 */
export function getCurrentStreakApi() {
  return request("/streaks/current");
}

/**
 * Actualizar la racha al completar una actividad
 * Incrementa si fue ayer, mantiene si fue hoy, resetea si hace más de 1 día
 * @returns {Promise<Object>} Racha actualizada
 */
export function updateStreakApi() {
  return request("/streaks/update", { method: "POST" });
}
