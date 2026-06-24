import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { handleDaily, handleMessage } from "../src/http.js";

test("message route rejects JSON null with a 400 response", async () => {
  const response = await runMessageRoute("null");

  assert.equal(response.statusCode, 400);
  assert.deepEqual(JSON.parse(response.body), {
    error: "invalid_request",
    message: "JSON body must be an object.",
    details: {
      field: "body"
    }
  });
});

test("message route rejects non-object JSON bodies with a 400 response", async () => {
  for (const body of ["[]", '"hello"']) {
    const response = await runMessageRoute(body);

    assert.equal(response.statusCode, 400);
    assert.equal(JSON.parse(response.body).details.field, "body");
  }
});

test("message route rejects invalid time zones with a 400 response", async () => {
  const response = await runMessageRoute(
    JSON.stringify({
      timeZone: "NotAZone",
      loveStart: "2022-05-20",
      people: [
        { name: "Person A", birthday: "08-16" },
        { name: "Person B", birthday: "11-03" }
      ],
      quote: {
        en: "A steady love makes ordinary days bright.",
        zh: "稳定的爱让普通日子也发光。"
      }
    })
  );

  assert.equal(response.statusCode, 400);
  assert.deepEqual(JSON.parse(response.body), {
    error: "invalid_request",
    message: "timeZone must be a valid IANA time zone.",
    details: {
      field: "timeZone"
    }
  });
});

test("daily route rejects invalid time zones with a 400 response", async () => {
  const response = await runDailyRoute(
    "http://localhost/api/daily?timeZone=NotAZone&loveStart=2022-05-20&person1Name=A&person1Birthday=08-16&person2Name=B&person2Birthday=11-03"
  );

  assert.equal(response.statusCode, 400);
  assert.deepEqual(JSON.parse(response.body), {
    error: "invalid_request",
    message: "timeZone must be a valid IANA time zone.",
    details: {
      field: "timeZone"
    }
  });
});

async function runMessageRoute(body) {
  const request = Readable.from([body]);
  request.method = "POST";
  request.headers = {
    "content-type": "application/json"
  };

  const response = createResponse();
  await handleMessage(request, response);
  return response.finished;
}

async function runDailyRoute(url) {
  const response = createResponse();
  handleDaily(new URL(url), response);
  return response.finished;
}

function createResponse() {
  let finish;
  const response = {
    statusCode: undefined,
    headers: {},
    chunks: [],
    finished: new Promise((resolve) => {
      finish = resolve;
    }),
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(chunk = "") {
      if (chunk) {
        this.chunks.push(Buffer.from(chunk));
      }
      this.body = Buffer.concat(this.chunks).toString("utf8");
      finish(this);
    }
  };

  return response;
}
