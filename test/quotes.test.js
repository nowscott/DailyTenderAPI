import test from "node:test";
import assert from "node:assert/strict";
import { getDailyQuote } from "../src/quotes.js";

test("uses Iciba content and note when the remote request succeeds", async () => {
  const result = await getDailyQuote({
    date: "2026-06-23",
    quoteArchive: { "2026-06-22": { en: "Earlier quote", zh: "旧语录" } },
    fetchImpl: async (url) => {
      assert.equal(url.searchParams.get("title"), "2026-06-23");
      return {
        ok: true,
        json: async () => ({
          title: "2026-06-23",
          content: "Remote English quote.",
          note: "远程中文短句。"
        })
      };
    }
  });

  assert.deepEqual(result, {
    quote: {
      en: "Remote English quote.",
      zh: "远程中文短句。"
    },
    quoteSource: "iciba"
  });
});

test("falls back when Iciba returns a different date", async () => {
  const result = await getDailyQuote({
    date: "2026-06-25",
    quoteArchive: { "2026-06-24": { en: "Earlier quote", zh: "历史语录" } },
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ title: "2026-06-22", content: "English", note: "中文" })
    })
  });
  assert.equal(result.quoteSource, "local-fallback");
  assert.deepEqual(result.quote, { en: "Earlier quote", zh: "历史语录" });
});

test("uses the archived Iciba quote before making a remote request", async () => {
  const result = await getDailyQuote({
    date: "2026-06-24",
    quoteArchive: {
      "2026-06-24": {
        en: "Archived English quote.",
        zh: "已留存的中文短句。"
      }
    },
    fetchImpl: async () => { throw new Error("should not request Iciba"); }
  });

  assert.deepEqual(result, {
    quote: {
      en: "Archived English quote.",
      zh: "已留存的中文短句。"
    },
    quoteSource: "iciba-cache"
  });
});

test("uses a stable historical quote when Iciba fails", async () => {
  const options = {
    date: "2026-06-26",
    quoteArchive: {
      "2026-06-24": { en: "First", zh: "第一句" },
      "2026-06-25": { en: "Second", zh: "第二句" },
      "2026-06-27": { en: "Future", zh: "未来" }
    },
    fetchImpl: async () => { throw new Error("network failed"); }
  };
  const result = await getDailyQuote(options);

  assert.equal(result.quoteSource, "local-fallback");
  assert.ok(["First", "Second"].includes(result.quote.en));
  assert.deepEqual(await getDailyQuote(options), result);
});

test("falls back to local quotes when no historical archive is available", async () => {
  const result = await getDailyQuote({
    date: "2026-06-23",
    quoteArchive: {},
    fetchImpl: async () => { throw new Error("network failed"); }
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
