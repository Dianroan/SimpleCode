// src/services/api/jdoodle.js
import { request } from "./http";

export function runJdoodleExampleApi(script) {
  return request("/jdoodle", {
    method: "POST",
    body: { script },
  });
}
