import { DEFAULT_QUOTES, selectQuote } from "./daily.js";
import { readFile } from "node:fs/promises";

const ICIBA_DAILY_URL = "https://sentence.iciba.com/index.php?c=dailysentence&m=getdetail";
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

  let archive;
  try {
    archive = options.quoteArchive || (await loadQuoteArchive());
  } catch {
    archive = {};
  }

  const archivedQuote = archive[date];
  if (archivedQuote && typeof archivedQuote.en === "string" && typeof archivedQuote.zh === "string") {
    return {
      quote: { en: archivedQuote.en.trim(), zh: archivedQuote.zh.trim() },
      quoteSource: "iciba-cache"
    };
  }

  try {
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
    const historicalQuotes = Object.entries(archive)
      .filter(([archiveDate, quote]) => archiveDate < date && quote &&
        typeof quote.en === "string" && quote.en.trim() &&
        typeof quote.zh === "string" && quote.zh.trim())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, quote]) => quote);
    return {
      quote: selectQuote(date, quoteMode, historicalQuotes.length ? historicalQuotes : DEFAULT_QUOTES),
      quoteSource: "local-fallback"
    };
  }
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
    const url = new URL(ICIBA_DAILY_URL);
    if (options.date) url.searchParams.set("title", options.date);
    const response = await fetchImpl(url, {
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
    if (options.date && data.title !== options.date) {
      throw new Error(`Iciba quote date ${data.title || "(missing)"} does not match ${options.date}.`);
    }

    return {
      en: data.content.trim(),
      zh: data.note.trim()
    };
  } finally {
    clearTimeout(timeout);
  }
}
