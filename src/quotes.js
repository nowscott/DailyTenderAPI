import { DEFAULT_QUOTES, selectQuote } from "./daily.js";
import { readFile } from "node:fs/promises";

const ICIBA_DAILY_URL = "https://open.iciba.com/dsapi/";
const ICIBA_ARCHIVE_URL = new URL("../data/quotes/iciba.json", import.meta.url);
const remoteQuoteCache = new Map();
let quoteArchivePromise;

export async function getDailyQuote(options = {}) {
  const date = options.date;
  const quoteMode = options.quoteMode || "daily";
  const source = options.source || "iciba";

  if (source === "local") {
    return {
      quote: selectQuote(date, quoteMode, DEFAULT_QUOTES),
      quoteSource: "local"
    };
  }

  if (source !== "iciba") {
    return {
      quote: selectQuote(date, quoteMode, DEFAULT_QUOTES),
      quoteSource: "local"
    };
  }

  try {
    const archivedQuote = await getArchivedQuote(date, options);
    if (archivedQuote) {
      return {
        quote: archivedQuote,
        quoteSource: "iciba-cache"
      };
    }

    const cacheKey = date || "today";
    if (!options.fetchImpl && remoteQuoteCache.has(cacheKey)) {
      return {
        quote: remoteQuoteCache.get(cacheKey),
        quoteSource: "iciba"
      };
    }

    const quote = await fetchIcibaQuote(options);
    if (!options.fetchImpl) {
      remoteQuoteCache.set(cacheKey, quote);
    }

    return {
      quote,
      quoteSource: "iciba"
    };
  } catch {
    return {
      quote: selectQuote(date, quoteMode, DEFAULT_QUOTES),
      quoteSource: "local-fallback"
    };
  }
}

async function getArchivedQuote(date, options = {}) {
  if (!date || options.fetchImpl) {
    return undefined;
  }

  const archive = options.quoteArchive || (await loadQuoteArchive());
  const quote = archive[date];
  if (!quote || typeof quote.en !== "string" || typeof quote.zh !== "string") {
    return undefined;
  }

  return {
    en: quote.en.trim(),
    zh: quote.zh.trim()
  };
}

async function loadQuoteArchive() {
  quoteArchivePromise ||= readFile(ICIBA_ARCHIVE_URL, "utf8")
    .then((content) => JSON.parse(content))
    .catch((error) => {
      if (error.code === "ENOENT") {
        return {};
      }
      throw error;
    });

  return quoteArchivePromise;
}

async function fetchIcibaQuote(options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const timeoutMs = Number(options.timeoutMs || 3000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(ICIBA_DAILY_URL, {
      headers: {
        "content-type": "application/json",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 DailyTenderAPI/0.1"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Iciba quote request failed with ${response.status}`);
    }

    const data = await response.json();
    if (!data || typeof data.content !== "string" || typeof data.note !== "string") {
      throw new Error("Iciba quote response is missing content or note.");
    }

    return {
      en: data.content.trim(),
      zh: data.note.trim()
    };
  } finally {
    clearTimeout(timeout);
  }
}
