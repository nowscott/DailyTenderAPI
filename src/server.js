import http from "node:http";
import { handleDaily, handleMessage, sendEmpty, sendJson } from "./http.js";
import { readFile } from "node:fs/promises";
import { homepageScript, homepageStyles, renderHomePage } from "./homepage.js";
import { SERVICE_VERSION } from "./version.js";

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
    isReadRequest(request) &&
    (requestUrl.pathname === "/health" || requestUrl.pathname === "/api/health")
  ) {
    sendMaybeJson(request, response, 200, {
      ok: true,
      service: "DailyTenderAPI",
      version: SERVICE_VERSION
    });
    return;
  }

  if (isReadRequest(request) && requestUrl.pathname === "/") {
    sendMaybeText(request, response, 200, "text/html; charset=utf-8", renderHomePage());
    return;
  }

  if (isReadRequest(request) && requestUrl.pathname === "/styles.css") {
    sendMaybeText(request, response, 200, "text/css; charset=utf-8", homepageStyles);
    return;
  }

  if (isReadRequest(request) && requestUrl.pathname === "/app.js") {
    sendMaybeText(request, response, 200, "application/javascript; charset=utf-8", homepageScript);
    return;
  }

  if (isReadRequest(request) && (requestUrl.pathname === "/icon.svg" || requestUrl.pathname === "/favicon.svg")) {
    await sendStaticFile(request, response, "public/icon.svg", "image/svg+xml; charset=utf-8");
    return;
  }

  if (isReadRequest(request) && requestUrl.pathname === "/site.webmanifest") {
    await sendStaticFile(request, response, "public/site.webmanifest", "application/manifest+json; charset=utf-8");
    return;
  }

  if (isReadRequest(request) && requestUrl.pathname === "/api") {
    sendMaybeJson(request, response, 200, {
      service: "DailyTenderAPI",
      version: SERVICE_VERSION,
      endpoints: ["/api/daily", "/api/message", "/api/health"]
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

function isReadRequest(request) {
  return request.method === "GET" || request.method === "HEAD";
}

function sendMaybeJson(request, response, statusCode, body) {
  if (request.method === "HEAD") {
    response.writeHead(statusCode, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    });
    response.end();
    return;
  }

  sendJson(response, statusCode, body);
}

function sendMaybeText(request, response, statusCode, contentType, body) {
  response.writeHead(statusCode, {
    "content-type": contentType,
    "cache-control": "no-store"
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  response.end(body);
}

async function sendStaticFile(request, response, path, contentType) {
  const body = await readFile(path, "utf8");
  response.writeHead(200, {
    "content-type": contentType,
    "cache-control": "public, max-age=3600"
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  response.end(body);
}
