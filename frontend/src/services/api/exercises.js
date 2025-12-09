/**
 * Servicios de API para ejercicios de programación
 * 
 * Endpoints:
 * - GET /api/exercises/:id - Obtener un ejercicio
 * - POST /api/exercises/:id/validate - Validar solución del usuario
 */

import { request } from "./http";

/**
 * Obtener un ejercicio por ID
 * @param {number} exerciseId - ID del ejercicio
 * @returns {Promise<Object>} Ejercicio con { id, title, description, initial_code, tags }
 */
export const getExerciseApi = async (exerciseId) => {
  return request(`/exercises/${exerciseId}`, { method: "GET" });
};

/**
 * Validar la solución de un ejercicio
 * Ejecuta el código en JDoodle y compara con los tests esperados
 * 
 * @param {number} exerciseId - ID del ejercicio
 * @param {string} code - Código C# del usuario
 * @returns {Promise<{success: boolean, results: Array, message: string}>}
 */
export const validateExerciseApi = async (exerciseId, code) => {
  return request(`/exercises/${exerciseId}/validate`, {
    method: "POST",
    body: { code }
  });
};
