import http from "node:http";
import { handleDaily, handleMessage, sendEmpty, sendJson } from "./http.js";

const PORT = Number(process.env.PORT || 3000);

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "OPTIONS") {
    sendEmpty(response, 204);
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/api/daily") {
    handleDaily(requestUrl, response);
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/message") {
    await handleMessage(request, response);
    return;
  }

  if (
    request.method === "GET" &&
    (requestUrl.pathname === "/health" || requestUrl.pathname === "/api/health")
  ) {
    sendJson(response, 200, { ok: true, service: "DailyTenderAPI" });
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/") {
    sendJson(response, 200, {
      service: "DailyTenderAPI",
      endpoints: ["/api/daily", "/api/message"]
    });
    return;
  }

  sendJson(response, 404, {
    error: "not_found",
    message: "Use GET /api/daily or POST /api/message."
  });
});

server.listen(PORT, () => {
  console.log(`DailyTenderAPI listening on http://localhost:${PORT}`);
});
