import { request } from "./http";

export function getTopWeaknessesApi() {
  return request("/weaknesses/top");
}

export function recordAttemptApi(payload) {
  // payload: { exercise_id, success, first_try }
  return request("/weaknesses/record-attempt", { method: "POST", body: payload });
}

export function communityReportApi(payload) {
  // payload: { tags: [], difficulty: 1|2|3 }
  return request("/weaknesses/community-report", { method: "POST", body: payload });
}
