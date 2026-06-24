import { sendEmpty, sendJson } from "../src/http.js";
import { SERVICE_VERSION } from "../src/version.js";

export default function handler(request, response) {
  if (request.method === "OPTIONS") {
    sendEmpty(response, 204);
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, 405, {
      error: "method_not_allowed",
      message: "Use GET /api/health."
    });
    return;
  }

  sendJson(response, 200, {
    ok: true,
    service: "DailyTenderAPI",
    version: SERVICE_VERSION
  });
}
