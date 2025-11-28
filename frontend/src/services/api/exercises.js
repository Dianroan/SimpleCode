import { request } from "./http";

export const getExerciseApi = async (exerciseId) => {
  return request(`/exercises/${exerciseId}`, { method: "GET" });
};

export const validateExerciseApi = async (exerciseId, code) => {
  return request(`/exercises/${exerciseId}/validate`, {
    method: "POST",
    body: { code }
  });
};
