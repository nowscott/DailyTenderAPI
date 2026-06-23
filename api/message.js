import { handleMessage, sendEmpty, sendJson } from "../src/http.js";

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    sendEmpty(response, 204);
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, {
      error: "method_not_allowed",
      message: "Use POST /api/message."
    });
    return;
  }

  await handleMessage(request, response);
}
