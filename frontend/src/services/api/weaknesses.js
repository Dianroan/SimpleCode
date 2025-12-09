/**
 * Servicios de API para análisis de debilidades del usuario
 * 
 * Registra fallos en ejercicios y genera estadísticas para identificar
 * áreas que necesitan más práctica
 */

import { request } from "./http";

/**
 * Obtener las principales debilidades (top fallos por etiqueta)
 * @returns {Promise<Array<{tag: string, fail_count: number}>>}
 */
export function getTopWeaknessesApi() {
  return request("/weaknesses/top");
}

/**
 * Obtener debilidades agrupadas por categoría
 * @returns {Promise<Object>} Objeto con categorías como claves
 */
export function getWeaknessesByCategoryApi() {
  return request("/weaknesses/by-category");
}

/**
 * Obtener lista de ejercicios fallidos
 * @returns {Promise<Array<Object>>} Ejercicios con número de fallos
 */
export function getFailedExercisesApi() {
  return request("/weaknesses/failed-exercises");
}

/**
 * Registrar un intento de ejercicio (exitoso o fallido)
 * @param {Object} payload - { exercise_id, success, first_try }
 */
export function recordAttemptApi(payload) {
  return request("/weaknesses/record-attempt", { method: "POST", body: payload });
}

/**
 * Obtener reporte de debilidades de la comunidad
 * @param {Object} payload - { tags: [], difficulty: 1|2|3 }
 */
export function communityReportApi(payload) {
  return request("/weaknesses/community-report", { method: "POST", body: payload });
}
