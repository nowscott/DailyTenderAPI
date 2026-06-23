import { handleDaily, sendEmpty, sendJson } from "../src/http.js";

export default function handler(request, response) {
  if (request.method === "OPTIONS") {
    sendEmpty(response, 204);
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, 405, {
      error: "method_not_allowed",
      message: "Use GET /api/daily."
    });
    return;
  }

  const requestUrl = new URL(request.url, `https://${request.headers.host || "localhost"}`);
  handleDaily(requestUrl, response);
}
