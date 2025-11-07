// frontend/src/services/http.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const { method = "GET", headers = {}, body } = options;

  // ⬇️ lee token en cada request (clave para “segundo login”)
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
    credentials: "omit", // no usamos cookies httpOnly
  });

  // Manejo estándar de JSON
  const isJSON = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJSON ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    const message = data?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}
