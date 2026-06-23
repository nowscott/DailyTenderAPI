const DAY_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_QUOTES = [
  {
    en: "You needn't be born radiant, but you can keep shining.",
    zh: "你不必天生闪耀，但可以持续发光。"
  },
  {
    en: "Every ordinary day is worth keeping with someone you love.",
    zh: "每一个普通的日子，和喜欢的人一起都值得收藏。"
  },
  {
    en: "The day gets softer when I know you are in it.",
    zh: "想到今天有你，日子就变得柔软起来。"
  },
  {
    en: "Love is the little promise we keep making in daily life.",
    zh: "爱是我们在日常里一次次兑现的小承诺。"
  },
  {
    en: "May your heart stay light, even when the day gets busy.",
    zh: "愿你即使忙碌，也能一直心里轻盈。"
  },
  {
    en: "I hope today gives you a reason to smile without trying.",
    zh: "希望今天能给你一个不用费力就想笑的理由。"
  },
  {
    en: "Some happiness is quiet, steady, and always beside you.",
    zh: "有些幸福安静、稳定，并且一直在身边。"
  },
  {
    en: "Let today be gentle to you, and let me be part of that gentleness.",
    zh: "愿今天温柔待你，也愿我成为这份温柔的一部分。"
  },
  {
    en: "Small moments become bright when they are shared with you.",
    zh: "小小的瞬间，因为和你分享而发亮。"
  },
  {
    en: "No matter how the weather changes, you are my clear sky.",
    zh: "无论天气怎么变，你都是我的晴天。"
  },
  {
    en: "The best part of my routine is still thinking of you.",
    zh: "我日常里最好的部分，依然是想起你。"
  },
  {
    en: "May the day treat you kindly, and may you treat yourself kindly too.",
    zh: "愿今天善待你，也愿你同样善待自己。"
  }
];

export class DailyTenderError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "DailyTenderError";
    this.details = details;
  }
}

export function todayInTimeZone(timeZone = "Asia/Shanghai") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function buildDailyPayload(input = {}) {
  const timeZone = input.timeZone || "Asia/Shanghai";
  const date = normalizeDate(input.date || todayInTimeZone(timeZone), "date");
  const loveStartDate = normalizeDate(input.loveStartDate, "loveStartDate");
  const person1Birthday = normalizeMonthDay(input.person1Birthday, "person1Birthday");
  const person2Birthday = normalizeMonthDay(input.person2Birthday, "person2Birthday");
  const person1Name = normalizeName(input.person1Name, "person1Name");
  const person2Name = normalizeName(input.person2Name, "person2Name");
  const quoteMode = input.quoteMode || "daily";

  const loveDays = daysBetweenInclusive(loveStartDate, date);
  const person1BirthdayInfo = nextBirthdayInfo(date, person1Birthday);
  const person2BirthdayInfo = nextBirthdayInfo(date, person2Birthday);
  const quote = input.quote
    ? normalizeQuote(input.quote, "quote")
    : selectQuote(date, quoteMode, input.quotes || DEFAULT_QUOTES);
  const quoteSource = input.quoteSource || (input.quote ? "provided" : "local");

  return {
    date,
    timeZone,
    names: {
      person1: person1Name,
      person2: person2Name
    },
    love: {
      startDate: loveStartDate,
      days: loveDays,
      countRule: "inclusive"
    },
    loveDays,
    person1BirthdayDays: person1BirthdayInfo.days,
    person2BirthdayDays: person2BirthdayInfo.days,
    birthdays: {
      person1: {
        name: person1Name,
        monthDay: person1Birthday,
        days: person1BirthdayInfo.days,
        nextDate: person1BirthdayInfo.nextDate
      },
      person2: {
        name: person2Name,
        monthDay: person2Birthday,
        days: person2BirthdayInfo.days,
        nextDate: person2BirthdayInfo.nextDate
      }
    },
    people: [
      {
        key: "person1",
        name: person1Name,
        birthday: person1Birthday,
        birthdayDays: person1BirthdayInfo.days,
        nextBirthday: person1BirthdayInfo.nextDate
      },
      {
        key: "person2",
        name: person2Name,
        birthday: person2Birthday,
        birthdayDays: person2BirthdayInfo.days,
        nextBirthday: person2BirthdayInfo.nextDate
      }
    ],
    quote,
    quoteSource
  };
}

export function buildMessagePayload(body = {}, options = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new DailyTenderError("JSON body must be an object.", { field: "body" });
  }

  const people = normalizePeople(resolvePeopleInput(body));
  const daily = buildDailyPayload({
    date: body.date,
    timeZone: body.timeZone,
    loveStartDate: body.loveStartDate || body.loveStart,
    person1Name: people[0].name,
    person2Name: people[1].name,
    person1Birthday: people[0].birthday,
    person2Birthday: people[1].birthday,
    quoteMode: body.quoteMode,
    quote: options.quote || body.quote,
    quoteSource: options.quoteSource || (body.quote ? "provided" : undefined)
  });

  const context = {
    date: daily.date,
    week: normalizeOptionalText(body.week, "week"),
    city: resolveCity(body),
    location: normalizeOptionalText(body.location || body.locationText || body.address, "location"),
    weather: normalizeOptionalText(body.weather, "weather"),
    temperature: normalizeOptionalText(body.temperature, "temperature"),
    feelsLike: normalizeOptionalText(body.feelsLike, "feelsLike"),
    rainProbability: normalizeOptionalText(body.rainProbability, "rainProbability")
  };

  return {
    ...daily,
    context,
    message: renderMessage(daily, context)
  };
}

function resolvePeopleInput(body) {
  if (body.people !== undefined) {
    return body.people;
  }

  if (
    body.person1Name !== undefined ||
    body.person1Birthday !== undefined ||
    body.person2Name !== undefined ||
    body.person2Birthday !== undefined
  ) {
    return [
      {
        name: body.person1Name,
        birthday: body.person1Birthday
      },
      {
        name: body.person2Name,
        birthday: body.person2Birthday
      }
    ];
  }

  return undefined;
}

export function extractCityFromLocationText(locationText) {
  const text = normalizeOptionalText(locationText, "location");
  if (!text) {
    return undefined;
  }

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const cityLine = lines.find((line) => /[\u4e00-\u9fa5A-Za-z0-9]+市(?:\s|$)/.test(line));
  if (cityLine) {
    const match = cityLine.match(/([\u4e00-\u9fa5A-Za-z0-9]+市)(?:\s|$)/);
    if (match) {
      return match[1];
    }
  }

  const regionLine = lines.find((line) => /[\u4e00-\u9fa5A-Za-z0-9]+(?:区|县|镇|街道)(?:\s|$)/.test(line));
  if (regionLine) {
    return regionLine.split(/\s+/)[0];
  }

  return lines[0];
}

export function buildInputFromSearchParams(searchParams, env = process.env) {
  return {
    date: firstValue(searchParams, "date") || undefined,
    timeZone: firstValue(searchParams, "timeZone") || env.TIME_ZONE || "Asia/Shanghai",
    loveStartDate:
      firstValue(searchParams, "loveStartDate") ||
      firstValue(searchParams, "loveStart") ||
      env.LOVE_START_DATE,
    person1Name: firstValue(searchParams, "person1Name") || env.PERSON1_NAME,
    person2Name: firstValue(searchParams, "person2Name") || env.PERSON2_NAME,
    person1Birthday: firstValue(searchParams, "person1Birthday") || env.PERSON1_BIRTHDAY,
    person2Birthday: firstValue(searchParams, "person2Birthday") || env.PERSON2_BIRTHDAY,
    quoteMode: firstValue(searchParams, "quoteMode") || env.QUOTE_MODE || "daily"
  };
}

export function validationErrorToResponse(error) {
  return {
    error: "invalid_request",
    message: error.message,
    details: error.details
  };
}

export function selectQuote(date, quoteMode, quotes) {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    throw new DailyTenderError("quotes must contain at least one quote.", { field: "quotes" });
  }

  if (quoteMode === "random") {
    return normalizeQuote(quotes[Math.floor(Math.random() * quotes.length)], "quote");
  }

  if (quoteMode !== "daily") {
    throw new DailyTenderError("quoteMode must be daily or random.", { field: "quoteMode" });
  }

  const index = Math.abs(daysBetween("1970-01-01", date)) % quotes.length;
  return normalizeQuote(quotes[index], "quote");
}

function renderMessage(daily, context) {
  const lines = [];
  const dateLine = [context.date, context.week].filter(Boolean).join(" ");
  if (dateLine) {
    lines.push(dateLine);
  }

  const weatherParts = [];
  if (context.city) weatherParts.push(context.city);
  if (context.weather) weatherParts.push(context.weather);
  if (context.temperature) weatherParts.push(`气温 ${context.temperature}`);
  if (context.feelsLike) weatherParts.push(`体感 ${context.feelsLike}`);
  if (context.rainProbability) weatherParts.push(`降雨概率 ${context.rainProbability}`);
  if (weatherParts.length > 0) {
    lines.push(weatherParts.join("，"));
  }

  if (lines.length > 0) {
    lines.push("");
  }

  lines.push(`我们已经在一起 ${daily.loveDays} 天啦。`);

  for (const person of daily.people) {
    if (person.birthdayDays === 0) {
      lines.push(`今天是${person.name}的生日，生日快乐！`);
    } else {
      lines.push(`距离${person.name}的生日还有 ${person.birthdayDays} 天。`);
    }
  }

  lines.push("");
  lines.push(daily.quote.zh);
  lines.push(daily.quote.en);

  return lines.join("\n");
}

function resolveCity(body) {
  const explicitCity = normalizeOptionalText(body.city, "city");
  if (explicitCity) {
    return explicitCity;
  }

  return extractCityFromLocationText(body.location || body.locationText || body.address);
}

function normalizeName(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new DailyTenderError(`${fieldName} is required.`, { field: fieldName });
  }

  return value.trim();
}

function normalizePeople(people) {
  if (people && typeof people === "object" && !Array.isArray(people)) {
    const keyedPeople = [people.person1, people.person2];
    if (keyedPeople.every(Boolean)) {
      return keyedPeople.map((person, index) => normalizePerson(person, `people.person${index + 1}`));
    }
  }

  if (!Array.isArray(people) || people.length !== 2) {
    throw new DailyTenderError("people must contain exactly two people.", { field: "people" });
  }

  return people.map((person, index) => normalizePerson(person, `people[${index}]`));
}

function normalizePerson(person, fieldPrefix) {
  if (!person || typeof person !== "object" || Array.isArray(person)) {
    throw new DailyTenderError(`${fieldPrefix} must be an object.`, { field: fieldPrefix });
  }

  return {
    name: normalizeName(person.name, `${fieldPrefix}.name`),
    birthday: normalizeMonthDay(person.birthday, `${fieldPrefix}.birthday`)
  };
}

function normalizeOptionalText(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string" && typeof value !== "number") {
    throw new DailyTenderError(`${fieldName} must be text.`, { field: fieldName });
  }

  return String(value).trim() || undefined;
}

function normalizeQuote(value, fieldName) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new DailyTenderError(`${fieldName} must be an object.`, { field: fieldName });
  }

  const en = normalizeName(value.en, `${fieldName}.en`);
  const zh = normalizeName(value.zh, `${fieldName}.zh`);
  return { en, zh };
}

function normalizeDate(value, fieldName) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new DailyTenderError(`${fieldName} must use YYYY-MM-DD.`, { field: fieldName });
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new DailyTenderError(`${fieldName} is not a valid calendar date.`, { field: fieldName });
  }

  return value;
}

function normalizeMonthDay(value, fieldName) {
  if (typeof value !== "string" || !/^\d{2}-\d{2}$/.test(value)) {
    throw new DailyTenderError(`${fieldName} must use MM-DD.`, { field: fieldName });
  }

  const [month, day] = value.split("-").map(Number);
  if (!isValidMonthDay(2024, month, day)) {
    throw new DailyTenderError(`${fieldName} is not a valid month-day value.`, {
      field: fieldName
    });
  }

  return value;
}

function daysBetweenInclusive(startDate, endDate) {
  const days = daysBetween(startDate, endDate) + 1;
  if (days < 1) {
    throw new DailyTenderError("loveStartDate cannot be later than date.", {
      field: "loveStartDate"
    });
  }

  return days;
}

function nextBirthdayInfo(currentDate, monthDay) {
  const [currentYear] = currentDate.split("-").map(Number);
  const [month, day] = monthDay.split("-").map(Number);
  let nextYear = currentYear;

  while (!isValidMonthDay(nextYear, month, day)) {
    nextYear += 1;
  }

  let nextDate = formatDate(nextYear, month, day);
  if (daysBetween(currentDate, nextDate) < 0) {
    nextYear += 1;
    while (!isValidMonthDay(nextYear, month, day)) {
      nextYear += 1;
    }
    nextDate = formatDate(nextYear, month, day);
  }

  return {
    days: daysBetween(currentDate, nextDate),
    nextDate
  };
}

function daysBetween(startDate, endDate) {
  return Math.round((dateToUtcMs(endDate) - dateToUtcMs(startDate)) / DAY_MS);
}

function dateToUtcMs(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function isValidMonthDay(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function firstValue(searchParams, key) {
  const value = searchParams.get(key);
  return value && value.trim() !== "" ? value.trim() : undefined;
}
