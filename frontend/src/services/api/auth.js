/**
 * Servicios de API para autenticación
 * 
 * Endpoints:
 * - POST /api/auth/login - Iniciar sesión
 * - POST /api/auth/register - Registrar usuario
 * - GET /api/auth/me - Obtener datos del usuario autenticado
 * - POST /api/auth/logout - Cerrar sesión (opcional)
 */

import { request } from "./http";

/**
 * Iniciar sesión
 * @param {Object} payload - { username, password }
 * @returns {Promise<{token: string, user: Object}>}
 */
export function loginApi(payload) {
  return request("/auth/login", {
    method: "POST",
    body: payload,
  });
}

/**
 * Registrar nuevo usuario
 * @param {Object} payload - { username, email, password, confirm }
 * @returns {Promise<{token: string, user: Object}>}
 */
export function registerApi(payload) {
  return request("/auth/register", {
    method: "POST",
    body: payload,
  });
}

/**
 * Obtener datos del usuario autenticado
 * Requiere token válido en localStorage
 * @returns {Promise<Object>} Datos del usuario
 */
export function meApi() {
  return request("/auth/me");
}

/**
 * Cerrar sesión (opcional, el cierre es principalmente del lado cliente)
 */
export function logoutApi() {
  return request("/auth/logout", { method: "POST" });
}
