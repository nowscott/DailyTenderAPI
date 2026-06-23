import { DEFAULT_QUOTES, selectQuote } from "./daily.js";

const ICIBA_DAILY_URL = "http://open.iciba.com/dsapi/";

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
    return {
      quote: await fetchIcibaQuote(options),
      quoteSource: "iciba"
    };
  } catch {
    return {
      quote: selectQuote(date, quoteMode, DEFAULT_QUOTES),
      quoteSource: "local-fallback"
    };
  }
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
