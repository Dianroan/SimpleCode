// src/services/api/jdoodle.js
import { request } from "./http";

export function runJdoodleExampleApi(script) {
  return request("/jdoodle/run-example", {
    method: "POST",
    body: { script },
  });
}
