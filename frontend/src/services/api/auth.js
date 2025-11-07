// src/services/api/auth.js
import { request } from "./http.js";

/** Inicia sesión y devuelve { token } */
export async function loginApi({ username, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

/** Registra usuario y devuelve { message } */
export async function registerApi({ username, email, password, confirm }) {
  return request("/api/auth/register", {
    method: "POST",
    body: { username, email, password, confirm },
  });
}

/** Obtiene info del usuario autenticado { id, username, email, created_at } */
export async function meApi() {
  return request("/api/auth/me", {
    method: "GET",
    auth: true,
  });
}
