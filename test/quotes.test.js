import test from "node:test";
import assert from "node:assert/strict";
import { getDailyQuote } from "../src/quotes.js";

test("uses Iciba content and note when the remote request succeeds", async () => {
  const result = await getDailyQuote({
    date: "2026-06-23",
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        content: "Remote English quote.",
        note: "远程中文短句。"
      })
    })
  });

  assert.deepEqual(result, {
    quote: {
      en: "Remote English quote.",
      zh: "远程中文短句。"
    },
    quoteSource: "iciba"
  });
});

test("uses the archived Iciba quote before making a remote request", async () => {
  const result = await getDailyQuote({
    date: "2026-06-24",
    quoteArchive: {
      "2026-06-24": {
        en: "Archived English quote.",
        zh: "已留存的中文短句。"
      }
    }
  });

  assert.deepEqual(result, {
    quote: {
      en: "Archived English quote.",
      zh: "已留存的中文短句。"
    },
    quoteSource: "iciba-cache"
  });
});

test("falls back to local quotes when Iciba fails", async () => {
  const result = await getDailyQuote({
    date: "2026-06-23",
    fetchImpl: async () => {
      throw new Error("network failed");
    }
  });

  assert.equal(result.quoteSource, "local-fallback");
  assert.equal(typeof result.quote.en, "string");
  assert.equal(typeof result.quote.zh, "string");
});

test("can force the local quote source", async () => {
  const result = await getDailyQuote({
    date: "2026-06-23",
    source: "local"
  });

  assert.equal(result.quoteSource, "local");
  assert.equal(typeof result.quote.en, "string");
  assert.equal(typeof result.quote.zh, "string");
});
