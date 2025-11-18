// frontend/src/services/api/learningPath.js

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function getLearningPath() {
  const res = await fetch(`${API_BASE_URL}/learning-path`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Error fetching learning path");
  }

  return await res.json();
}

export async function getTheoryActivity(courseId) {
  const res = await fetch(`${API_BASE_URL}/learning-path/theory/${courseId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Error fetching theory activity");
  }

  return await res.json();
}

// src/services/api/learningPath.js
import { request } from "./http";

// Obtiene toda la ruta de aprendizaje del usuario
export function getLearningPathApi() {
  return request("/learning-path");
}

// Obtiene una actividad de teoría por courseId
export function getTheoryActivityApi(courseId) {
  return request(`/learning-path/theory/${courseId}`);
}
