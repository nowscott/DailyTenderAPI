import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICIBA_DAILY_URL = "https://open.iciba.com/dsapi/";
const TIME_ZONE = "Asia/Shanghai";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const quoteFile = resolve(repoRoot, "data/quotes/iciba.json");

const targetDate = process.env.QUOTE_DATE || todayInTimeZone(TIME_ZONE);
const fetchedAt = new Date().toISOString();
const url = new URL(ICIBA_DAILY_URL);
url.searchParams.set("date", targetDate);

const response = await fetch(url, {
  headers: {
    "user-agent": "DailyTenderAPI quote archive workflow"
  }
});

if (!response.ok) {
  throw new Error(`Iciba quote request failed with ${response.status}`);
}

const data = await response.json();
if (!data || typeof data.content !== "string" || typeof data.note !== "string") {
  throw new Error("Iciba quote response is missing content or note.");
}

if (data.dateline !== targetDate) {
  throw new Error(`Iciba quote dateline ${data.dateline || "(missing)"} does not match ${targetDate}.`);
}

const quotes = await readQuotes();
const archived = quotes[targetDate];
const nextQuote = {
  en: data.content.trim(),
  zh: data.note.trim(),
  source: "iciba",
  sid: data.sid ? String(data.sid) : undefined
};

if (
  archived &&
  archived.en === nextQuote.en &&
  archived.zh === nextQuote.zh &&
  archived.sid === nextQuote.sid
) {
  console.log(`Iciba quote for ${targetDate} is already archived.`);
  process.exit(0);
}

const nextQuotes = {
  ...quotes,
  [targetDate]: {
    ...nextQuote,
    fetchedAt
  }
};

await writeFile(quoteFile, `${JSON.stringify(sortByKey(nextQuotes), null, 2)}\n`, "utf8");
console.log(`Archived Iciba quote for ${targetDate}.`);

async function readQuotes() {
  try {
    return JSON.parse(await readFile(quoteFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

function sortByKey(value) {
  return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)));
}

function todayInTimeZone(timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
