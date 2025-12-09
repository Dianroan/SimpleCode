/**
 * Servicio de API para ejecutar código C# usando JDoodle
 * 
 * Usado principalmente en páginas de teoría para ejecutar ejemplos.
 * Para validar ejercicios, usar validateExerciseApi de exercises.js
 */

import { request } from "./http";

/**
 * Ejecutar código C# de ejemplo
 * @param {string} script - Código C# a ejecutar
 * @returns {Promise<{output: string, statusCode: number, cpuTime: number}>}
 */
export function runJdoodleExampleApi(script) {
  return request("/jdoodle/run-example", {
    method: "POST",
    body: { script },
  });
}
