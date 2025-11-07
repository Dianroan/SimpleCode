// frontend/src/services/api/auth.js
import { request } from "./http";

export function loginApi(payload) {
  // backend debe devolver { token, user }
  return request("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function registerApi(payload) {
  return request("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function meApi() {
  // requiere Bearer (lo añade http.js leyendo localStorage)
  return request("/auth/me");
}

export function logoutApi() {
  // si tu backend expone logout; si no, puedes omitir esto
  return request("/auth/logout", { method: "POST" });
}
