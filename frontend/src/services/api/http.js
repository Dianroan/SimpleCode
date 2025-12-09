/**
 * Cliente HTTP base para comunicación con el backend
 * 
 * Proporciona una función centralizada que:
 * - Construye URLs completas usando VITE_API_URL
 * - Añade automáticamente el token JWT a cada petición
 * - Maneja errores de forma consistente
 * - Parsea respuestas JSON
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * Realiza una petición HTTP al backend
 * 
 * @param {string} path - Ruta del endpoint (ej: "/auth/login")
 * @param {Object} options - Configuración de la petición
 * @param {string} options.method - Método HTTP (GET, POST, etc.)
 * @param {Object} options.headers - Headers adicionales
 * @param {Object} options.body - Datos a enviar (se convierten a JSON)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const { method = "GET", headers = {}, body } = options;

  // Lee el token en CADA petición (importante tras refrescar página)
  const token = localStorage.getItem("token");
  const authHeaders = { ...headers };
  if (token) authHeaders.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "omit",
  });

  const isJSON = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJSON ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    const message = data?.error || data?.message || `HTTP ${res.status}`;
    const err = new Error(message);
    err.response = { data, status: res.status };
    throw err;
  }

  return data;
}
