const DAY_MS = 24 * 60 * 60 * 1000;
const LUNAR_BIRTHDAY_SCAN_DAYS = 10 * 390;

let chineseCalendarFormatter;

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
  const normalizedTimeZone = normalizeTimeZone(timeZone);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: normalizedTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function buildDailyPayload(input = {}) {
  const timeZone = normalizeTimeZone(input.timeZone || "Asia/Shanghai");
  const date = normalizeDate(input.date || todayInTimeZone(timeZone), "date");
  const loveStartDate = normalizeDate(input.loveStartDate, "loveStartDate");
  const person1Birthday = normalizeBirthday(
    input.person1Birthday,
    "person1Birthday",
    input.person1Calendar,
    input.person1LeapMonth
  );
  const person2Birthday = normalizeBirthday(
    input.person2Birthday,
    "person2Birthday",
    input.person2Calendar,
    input.person2LeapMonth
  );
  const person1Name = normalizeName(input.person1Name, "person1Name");
  const person2Name = normalizeName(input.person2Name, "person2Name");
  const quoteMode = input.quoteMode || "daily";
  const loveCountRule = input.loveCountRule || "exclusive";

  const loveDays = countLoveDays(loveStartDate, date, loveCountRule);
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
      countRule: loveCountRule
    },
    loveDays,
    person1BirthdayDays: person1BirthdayInfo.days,
    person2BirthdayDays: person2BirthdayInfo.days,
    birthdays: {
      person1: {
        name: person1Name,
        monthDay: person1Birthday.monthDay,
        ...birthdayCalendarFields(person1Birthday),
        days: person1BirthdayInfo.days,
        nextDate: person1BirthdayInfo.nextDate
      },
      person2: {
        name: person2Name,
        monthDay: person2Birthday.monthDay,
        ...birthdayCalendarFields(person2Birthday),
        days: person2BirthdayInfo.days,
        nextDate: person2BirthdayInfo.nextDate
      }
    },
    people: [
      {
        key: "person1",
        name: person1Name,
        birthday: person1Birthday.monthDay,
        ...birthdayCalendarFields(person1Birthday),
        birthdayDays: person1BirthdayInfo.days,
        nextBirthday: person1BirthdayInfo.nextDate
      },
      {
        key: "person2",
        name: person2Name,
        birthday: person2Birthday.monthDay,
        ...birthdayCalendarFields(person2Birthday),
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
    person1Calendar: people[0].calendar,
    person2Calendar: people[1].calendar,
    person1LeapMonth: people[0].leapMonth,
    person2LeapMonth: people[1].leapMonth,
    quoteMode: body.quoteMode,
    loveCountRule: body.loveCountRule,
    quote: options.quote || body.quote,
    quoteSource: options.quoteSource || (body.quote ? "provided" : undefined)
  });

  const decoratedPeople = daily.people.map((person, index) => ({
    ...person,
    emoji: people[index].emoji || defaultPersonEmoji(index)
  }));

  const context = {
    date: daily.date,
    displayDate: normalizeOptionalText(body.displayDate, "displayDate") || formatChineseDate(daily.date),
    week: normalizeOptionalText(body.week, "week"),
    city: resolveCity(body),
    location: normalizeOptionalText(body.location || body.locationText || body.address, "location"),
    weather: normalizeOptionalText(body.weather, "weather"),
    temperature: normalizeOptionalText(body.temperature, "temperature"),
    feelsLike:
      normalizeOptionalText(body.feelsLike, "feelsLike") ||
      normalizeOptionalText(body.temperature, "temperature"),
    rainProbability: formatRainProbability(normalizeOptionalText(body.rainProbability, "rainProbability"))
  };
  const messageOptions = {
    greetingText: normalizeOptionalText(body.greetingText, "greetingText") || "早安吖",
    to: normalizeOptionalText(body.to, "to") || decoratedPeople[0].name,
    closingText: normalizeOptionalText(body.closingText, "closingText") || "今天也要记得好好吃饭哦！",
    emojis: normalizeEmojis(body.emojis)
  };

  return {
    ...daily,
    people: decoratedPeople,
    context,
    messageOptions,
    message: renderMessage({ ...daily, people: decoratedPeople }, context, messageOptions)
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
        birthday: body.person1Birthday,
        calendar: body.person1Calendar,
        leapMonth: body.person1LeapMonth,
        emoji: body.person1Emoji
      },
      {
        name: body.person2Name,
        birthday: body.person2Birthday,
        calendar: body.person2Calendar,
        leapMonth: body.person2LeapMonth,
        emoji: body.person2Emoji
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
    const city = extractCityFromLine(cityLine);
    if (city) {
      return city;
    }
  }

  const inlineCity = lines.map(extractCityFromLine).find(Boolean);
  if (inlineCity) {
    return inlineCity;
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
    person1Calendar: firstValue(searchParams, "person1Calendar") || env.PERSON1_CALENDAR,
    person2Calendar: firstValue(searchParams, "person2Calendar") || env.PERSON2_CALENDAR,
    person1LeapMonth: firstValue(searchParams, "person1LeapMonth") || env.PERSON1_LEAP_MONTH,
    person2LeapMonth: firstValue(searchParams, "person2LeapMonth") || env.PERSON2_LEAP_MONTH,
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

function renderMessage(daily, context, options) {
  const emojis = options.emojis;
  const lines = [
    `${emojis.greeting}${options.greetingText}${options.to}`,
    `${emojis.date}${context.displayDate}${context.week ? ` ${context.week}` : ""}`,
    `${emojis.city}城市：${context.city || ""}`,
    `${emojis.weather}天气：${context.weather || ""}`,
    `${emojis.feelsLike}体感温度：${context.feelsLike || ""}`,
    `${emojis.rain}降雨概率：${context.rainProbability || ""}`,
    `${emojis.love}今天是我们恋爱的第${daily.loveDays}天`
  ];

  for (const person of daily.people) {
    if (person.birthdayDays === 0) {
      lines.push(`${person.emoji}今天是${person.name}生日，祝${person.name}生日快乐！`);
    } else {
      lines.push(`${person.emoji}距离${person.name}生日还有${person.birthdayDays}天`);
    }
  }

  lines.push(`${emojis.closing}${options.closingText}`);
  lines.push("");
  lines.push(daily.quote.en);
  lines.push(daily.quote.zh);

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

  const birthday = normalizeBirthday(
    person.birthday,
    `${fieldPrefix}.birthday`,
    person.calendar,
    person.leapMonth
  );

  return {
    name: normalizeName(person.name, `${fieldPrefix}.name`),
    birthday: birthday.monthDay,
    ...birthdayCalendarFields(birthday),
    emoji: normalizeOptionalText(person.emoji, `${fieldPrefix}.emoji`)
  };
}

function normalizeEmojis(value) {
  const defaults = {
    greeting: "🌞",
    date: "📆",
    city: "🏡",
    weather: "🌤️",
    feelsLike: "🫠",
    rain: "☔️",
    love: "💖",
    closing: "🥰"
  };

  if (value === undefined || value === null) {
    return defaults;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    throw new DailyTenderError("emojis must be an object.", { field: "emojis" });
  }

  return Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => [
      key,
      normalizeOptionalText(value[key], `emojis.${key}`) || fallback
    ])
  );
}

function defaultPersonEmoji(index) {
  return index === 0 ? "🦌" : "🌙";
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

function normalizeTimeZone(value, fieldName = "timeZone") {
  if (typeof value !== "string" || value.trim() === "") {
    throw new DailyTenderError(`${fieldName} must be a valid IANA time zone.`, {
      field: fieldName
    });
  }

  const timeZone = value.trim();
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date(0));
  } catch {
    throw new DailyTenderError(`${fieldName} must be a valid IANA time zone.`, {
      field: fieldName
    });
  }

  return timeZone;
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

function normalizeBirthday(value, fieldName, calendarHint, leapMonthHint) {
  let birthdayValue = value;
  let calendarValue = calendarHint;
  let leapMonthValue = leapMonthHint;

  if (value && typeof value === "object" && !Array.isArray(value)) {
    birthdayValue = value.monthDay ?? value.date ?? value.value;
    calendarValue = value.calendar ?? value.type ?? calendarHint;
    leapMonthValue = value.leapMonth ?? leapMonthHint;
  }

  const calendar = normalizeBirthdayCalendar(calendarValue, `${fieldName}.calendar`);
  const leapMonth = normalizeBirthdayLeapMonth(leapMonthValue, `${fieldName}.leapMonth`);
  if (leapMonth && calendar !== "lunar") {
    throw new DailyTenderError(`${fieldName}.leapMonth only applies to lunar birthdays.`, {
      field: `${fieldName}.leapMonth`
    });
  }

  const monthDay =
    calendar === "lunar"
      ? normalizeLunarMonthDay(birthdayValue, fieldName)
      : normalizeMonthDay(birthdayValue, fieldName);

  return {
    monthDay,
    calendar,
    leapMonth: calendar === "lunar" ? leapMonth : false
  };
}

function birthdayCalendarFields(birthday) {
  if (birthday.calendar !== "lunar") {
    return {};
  }

  return {
    calendar: "lunar",
    leapMonth: birthday.leapMonth
  };
}

function normalizeBirthdayCalendar(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return "solar";
  }

  if (typeof value !== "string") {
    throw new DailyTenderError(`${fieldName} must be lunar when provided.`, { field: fieldName });
  }

  const calendar = value.trim().toLowerCase();
  if (["lunar", "农历", "阴历"].includes(calendar)) {
    return "lunar";
  }

  throw new DailyTenderError(`${fieldName} must be lunar when provided.`, { field: fieldName });
}

function normalizeBirthdayLeapMonth(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "no"].includes(normalized)) {
      return false;
    }
  }

  throw new DailyTenderError(`${fieldName} must be a boolean.`, { field: fieldName });
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

function normalizeLunarMonthDay(value, fieldName) {
  if (typeof value !== "string" || !/^\d{2}-\d{2}$/.test(value)) {
    throw new DailyTenderError(`${fieldName} must use MM-DD.`, { field: fieldName });
  }

  const [month, day] = value.split("-").map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 30) {
    throw new DailyTenderError(`${fieldName} is not a valid lunar month-day value.`, {
      field: fieldName
    });
  }

  return value;
}

function countLoveDays(startDate, endDate, countRule) {
  const difference = daysBetween(startDate, endDate);
  if (difference < 0) {
    throw new DailyTenderError("loveStartDate cannot be later than date.", {
      field: "loveStartDate"
    });
  }

  if (countRule === "exclusive") {
    return difference;
  }

  if (countRule === "inclusive") {
    return difference + 1;
  }

  throw new DailyTenderError("loveCountRule must be exclusive or inclusive.", {
    field: "loveCountRule"
  });
}

function nextBirthdayInfo(currentDate, birthday) {
  if (birthday.calendar === "lunar") {
    return nextLunarBirthdayInfo(currentDate, birthday);
  }

  return nextSolarBirthdayInfo(currentDate, birthday.monthDay);
}

function nextSolarBirthdayInfo(currentDate, monthDay) {
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

function nextLunarBirthdayInfo(currentDate, birthday) {
  const [targetMonth, targetDay] = birthday.monthDay.split("-").map(Number);
  for (let offset = 0; offset <= LUNAR_BIRTHDAY_SCAN_DAYS; offset += 1) {
    const nextDate = addDays(currentDate, offset);
    const lunar = getLunarMonthDay(nextDate);
    if (
      lunar.month === targetMonth &&
      lunar.day === targetDay &&
      lunar.leapMonth === birthday.leapMonth
    ) {
      return {
        days: offset,
        nextDate
      };
    }
  }

  throw new DailyTenderError("Could not find the next lunar birthday in the supported range.", {
    field: "birthday"
  });
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

function addDays(dateString, days) {
  const date = new Date(dateToUtcMs(dateString) + days * DAY_MS);
  return formatDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

function getLunarMonthDay(dateString) {
  const parts = getChineseCalendarFormatter().formatToParts(new Date(dateToUtcMs(dateString)));
  const monthPart = parts.find((part) => part.type === "month");
  const dayPart = parts.find((part) => part.type === "day");
  const rawMonth = monthPart?.value;
  const rawDay = dayPart?.value;
  const leapMonth = rawMonth?.endsWith("bis") || false;
  const month = Number(rawMonth?.replace("bis", ""));
  const day = Number(rawDay);

  if (!Number.isInteger(month) || !Number.isInteger(day)) {
    throw new DailyTenderError("Lunar birthday calculation is not available in this runtime.", {
      field: "birthday"
    });
  }

  return {
    month,
    day,
    leapMonth
  };
}

function getChineseCalendarFormatter() {
  if (!chineseCalendarFormatter) {
    try {
      chineseCalendarFormatter = new Intl.DateTimeFormat("en-US-u-ca-chinese", {
        timeZone: "UTC",
        month: "numeric",
        day: "numeric"
      });
    } catch {
      throw new DailyTenderError("Lunar birthday calculation is not available in this runtime.", {
        field: "birthday"
      });
    }
  }

  return chineseCalendarFormatter;
}

function formatChineseDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${year}年${month}月${day}日`;
}

function formatRainProbability(value) {
  if (!value) {
    return undefined;
  }

  return value.includes("%") || value.includes("％") ? value : `${value}%`;
}

function extractCityFromLine(line) {
  const directAdminCity = line.match(/(北京市|上海市|天津市|重庆市)/);
  if (directAdminCity) {
    return directAdminCity[1];
  }

  const afterProvinceCity = line.match(/(?:^|省|自治区|特别行政区)([^省区县镇街道\s]+市)/);
  if (afterProvinceCity) {
    return afterProvinceCity[1];
  }

  const city = line.match(/([\u4e00-\u9fa5A-Za-z0-9]+?市)/);
  return city ? city[1] : undefined;
}

function firstValue(searchParams, key) {
  const value = searchParams.get(key);
  return value && value.trim() !== "" ? value.trim() : undefined;
}
