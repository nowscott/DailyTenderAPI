import {
  buildDailyPayload,
  buildInputFromSearchParams,
  buildMessagePayload,
  DailyTenderError,
  todayInTimeZone,
  validationErrorToResponse
} from "./daily.js";
import { getDailyQuote } from "./quotes.js";

const MAX_JSON_BODY_BYTES = 64 * 1024;

export function responseHeaders() {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}

export function sendEmpty(response, statusCode) {
  response.writeHead(statusCode, responseHeaders());
  response.end();
}

export function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, responseHeaders());
  response.end(`${JSON.stringify(body, null, 2)}\n`);
}

export function handleDaily(requestUrl, response) {
  try {
    const payload = buildDailyPayload(buildInputFromSearchParams(requestUrl.searchParams));
    sendJson(response, 200, payload);
  } catch (error) {
    handleError(response, error, "DailyTenderAPI failed to build the response.");
  }
}

export async function handleMessage(request, response) {
  try {
    const body = await readJsonBody(request);
    const date = body.date || todayInTimeZone(body.timeZone || process.env.TIME_ZONE || "Asia/Shanghai");
    const quote = body.quote
      ? { quote: body.quote, quoteSource: "provided" }
      : await getDailyQuote({
          date,
          quoteMode: body.quoteMode,
          source: body.quoteSource || process.env.QUOTE_SOURCE || "iciba"
        });

    const payload = buildMessagePayload(
      {
        ...body,
        date
      },
      quote
    );
    sendJson(response, 200, payload);
  } catch (error) {
    handleError(response, error, "DailyTenderAPI failed to build the message response.");
  }
}

export function handleError(response, error, fallbackMessage) {
  if (error instanceof DailyTenderError) {
    sendJson(response, 400, validationErrorToResponse(error));
    return;
  }

  console.error(error);
  sendJson(response, 500, {
    error: "internal_error",
    message: fallbackMessage
  });
}

export function readJsonBody(request) {
  if (request.body !== undefined) {
    if (typeof request.body === "string") {
      try {
        return Promise.resolve(normalizeJsonObjectBody(JSON.parse(request.body)));
      } catch (error) {
        return Promise.reject(
          error instanceof DailyTenderError
            ? error
            : new DailyTenderError("JSON body is invalid.", { field: "body" })
        );
      }
    }

    return Promise.resolve(normalizeJsonObjectBody(request.body));
  }

  return new Promise((resolve, reject) => {
    let rawBody = "";

    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      rawBody += chunk;
      if (Buffer.byteLength(rawBody, "utf8") > MAX_JSON_BODY_BYTES) {
        reject(
          new DailyTenderError("JSON body is too large.", {
            field: "body",
            maxBytes: MAX_JSON_BODY_BYTES
          })
        );
        request.destroy();
      }
    });

    request.on("end", () => {
      if (rawBody.trim() === "") {
        reject(new DailyTenderError("JSON body is required.", { field: "body" }));
        return;
      }

      try {
        resolve(normalizeJsonObjectBody(JSON.parse(rawBody)));
      } catch (error) {
        reject(
          error instanceof DailyTenderError
            ? error
            : new DailyTenderError("JSON body is invalid.", { field: "body" })
        );
      }
    });

    request.on("error", reject);
  });
}

function normalizeJsonObjectBody(value) {
  const body = trimObjectKeys(value);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new DailyTenderError("JSON body must be an object.", { field: "body" });
  }

  return body;
}

function trimObjectKeys(value) {
  if (Array.isArray(value)) {
    return value.map(trimObjectKeys);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [key.trim(), trimObjectKeys(nestedValue)])
  );
}
