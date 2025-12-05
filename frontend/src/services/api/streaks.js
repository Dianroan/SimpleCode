import { request } from "./http";

export function getCurrentStreakApi() {
  return request("/streaks/current");
}

export function updateStreakApi() {
  return request("/streaks/update", { method: "POST" });
}
