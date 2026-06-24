import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDailyPayload,
  buildInputFromSearchParams,
  buildMessagePayload,
  DailyTenderError,
  extractCityFromLocationText
} from "../src/daily.js";

test("builds the shortcut-friendly daily payload with transmitted names", () => {
  const payload = buildDailyPayload({
    date: "2026-06-23",
    loveStartDate: "2026-06-20",
    person1Name: "Person A",
    person2Name: "Person B",
    person1Birthday: "06-23",
    person2Birthday: "06-22"
  });

  assert.equal(payload.date, "2026-06-23");
  assert.equal(payload.loveDays, 3);
  assert.equal(payload.love.countRule, "exclusive");
  assert.equal(payload.names.person1, "Person A");
  assert.equal(payload.names.person2, "Person B");
  assert.equal(payload.person1BirthdayDays, 0);
  assert.equal(payload.person2BirthdayDays, 364);
  assert.equal(payload.birthdays.person1.nextDate, "2026-06-23");
  assert.equal(payload.birthdays.person2.nextDate, "2027-06-22");
  assert.deepEqual(payload.people.map((person) => person.name), ["Person A", "Person B"]);
  assert.equal(typeof payload.quote.en, "string");
  assert.equal(typeof payload.quote.zh, "string");
});

test("selects the same daily quote for the same date", () => {
  const input = {
    date: "2026-06-23",
    loveStartDate: "2026-01-01",
    person1Name: "A",
    person2Name: "B",
    person1Birthday: "01-02",
    person2Birthday: "01-03"
  };

  assert.deepEqual(buildDailyPayload(input).quote, buildDailyPayload(input).quote);
});

test("supports leap-day birthdays by jumping to the next valid leap year", () => {
  const payload = buildDailyPayload({
    date: "2026-03-01",
    loveStartDate: "2026-01-01",
    person1Name: "Person A",
    person2Name: "Person B",
    person1Birthday: "02-29",
    person2Birthday: "03-01"
  });

  assert.equal(payload.birthdays.person1.nextDate, "2028-02-29");
  assert.equal(payload.birthdays.person2.days, 0);
});

test("reads input from query parameters before environment fallbacks", () => {
  const params = new URLSearchParams({
    date: "2026-06-23",
    loveStart: "2026-06-20",
    person1Name: "Query Person",
    person1Birthday: "06-23"
  });

  const input = buildInputFromSearchParams(params, {
    LOVE_START_DATE: "2020-01-01",
    PERSON1_NAME: "Env Person 1",
    PERSON2_NAME: "Env Person 2",
    PERSON1_BIRTHDAY: "01-01",
    PERSON2_BIRTHDAY: "12-31"
  });

  assert.equal(input.loveStartDate, "2026-06-20");
  assert.equal(input.person1Name, "Query Person");
  assert.equal(input.person2Name, "Env Person 2");
  assert.equal(input.person1Birthday, "06-23");
  assert.equal(input.person2Birthday, "12-31");
});

test("rejects missing names because names are part of the request contract", () => {
  assert.throws(
    () =>
      buildDailyPayload({
        date: "2026-06-23",
        loveStartDate: "2026-01-01",
        person1Birthday: "01-02",
        person2Birthday: "01-03"
      }),
    DailyTenderError
  );
});

test("builds a full message from shortcut JSON input", () => {
  const payload = buildMessagePayload(
    {
      date: "2026-06-23",
      week: "星期二",
      city: "杭州",
      weather: "多云",
      feelsLike: "32°C",
      rainProbability: "40%",
      loveStart: "2026-06-20",
      people: [
        { name: "Person A", birthday: "06-23" },
        { name: "Person B", birthday: "06-22" }
      ]
    },
    {
      quote: {
        en: "A steady love makes ordinary days bright.",
        zh: "稳定的爱让普通日子也发光。"
      },
      quoteSource: "test"
    }
  );

  assert.equal(payload.loveDays, 3);
  assert.equal(payload.person1BirthdayDays, 0);
  assert.equal(payload.person2BirthdayDays, 364);
  assert.equal(payload.quoteSource, "test");
  assert.match(payload.message, /📆2026年06月23日 星期二/);
  assert.match(payload.message, /🏡城市：杭州/);
  assert.match(payload.message, /🌤️天气：多云/);
  assert.match(payload.message, /🫠体感温度：32°C/);
  assert.match(payload.message, /☔️降雨概率：40%/);
  assert.match(payload.message, /💖今天是我们恋爱的第3天/);
  assert.match(payload.message, /🦌今天是Person A生日，祝Person A生日快乐！/);
  assert.match(payload.message, /🌙距离Person B生日还有364天/);
  assert.match(payload.message, /稳定的爱让普通日子也发光。/);
});

test("renders the final send-ready morning message template", () => {
  const payload = buildMessagePayload(
    {
      date: "2026-06-23",
      week: "星期二",
      location: "中国\n浙江省\n杭州市 西湖区\n文三路",
      weather: "晴间多云",
      feelsLike: "33°C",
      rainProbability: "40",
      loveStart: "2022-05-20",
      greetingName: "小鹿",
      greetingText: "早安吖",
      closingText: "今天也要记得好好吃饭哦！",
      people: [
        { name: "小鹿", birthday: "08-16", emoji: "🦌" },
        { name: "星河", birthday: "11-03", emoji: "🌙" }
      ]
    },
    {
      quote: {
        en: "You needn't be born radiant, but you can keep shining.",
        zh: "你不必天生闪耀，但可以持续发光。"
      },
      quoteSource: "test"
    }
  );

  assert.equal(
    payload.message,
    [
      "🌞早安吖小鹿",
      "📆2026年06月23日 星期二",
      "🏡城市：杭州市",
      "🌤️天气：晴间多云",
      "🫠体感温度：33°C",
      "☔️降雨概率：40%",
      "💖今天是我们恋爱的第1495天",
      "🦌距离小鹿生日还有54天",
      "🌙距离星河生日还有133天",
      "🥰今天也要记得好好吃饭哦！",
      "",
      "You needn't be born radiant, but you can keep shining.",
      "你不必天生闪耀，但可以持续发光。"
    ].join("\n")
  );
});

test("requires exactly two people for the full message endpoint", () => {
  assert.throws(
    () =>
      buildMessagePayload({
        date: "2026-06-23",
        loveStart: "2026-06-20",
        people: [{ name: "Person A", birthday: "06-23" }]
      }),
    DailyTenderError
  );
});

test("extracts a city from raw iOS location text", () => {
  const location = "中国\n浙江省\n杭州市 西湖区\n文三路";

  assert.equal(extractCityFromLocationText(location), "杭州市");
});

test("uses location text as city fallback for the full message", () => {
  const payload = buildMessagePayload(
    {
      date: "2026-06-23",
      week: "星期二",
      location: "中国\n浙江省\n杭州市 西湖区\n文三路",
      weather: "多云",
      feelsLike: "32°C",
      rainProbability: "40%",
      loveStart: "2026-06-20",
      people: [
        { name: "Person A", birthday: "06-23" },
        { name: "Person B", birthday: "06-22" }
      ]
    },
    {
      quote: {
        en: "A steady love makes ordinary days bright.",
        zh: "稳定的爱让普通日子也发光。"
      },
      quoteSource: "test"
    }
  );

  assert.equal(payload.context.city, "杭州市");
  assert.equal(payload.context.location, "中国\n浙江省\n杭州市 西湖区\n文三路");
  assert.match(payload.message, /🏡城市：杭州市/);
});

test("extracts a city from compact province-city-district text", () => {
  assert.equal(extractCityFromLocationText("中国\n浙江省杭州市西湖区文三路"), "杭州市");
  assert.equal(extractCityFromLocationText("广东省广州市天河区体育西路"), "广州市");
  assert.equal(extractCityFromLocationText("上海市浦东新区世纪大道"), "上海市");
});

test("uses temperature as the feels-like fallback in the final message", () => {
  const payload = buildMessagePayload(
    {
      date: "2026-06-23",
      city: "杭州",
      weather: "多云",
      temperature: "31°C",
      rainProbability: "40",
      loveStart: "2026-06-20",
      people: [
        { name: "Person A", birthday: "06-23" },
        { name: "Person B", birthday: "06-22" }
      ]
    },
    {
      quote: {
        en: "A steady love makes ordinary days bright.",
        zh: "稳定的爱让普通日子也发光。"
      },
      quoteSource: "test"
    }
  );

  assert.equal(payload.context.temperature, "31°C");
  assert.equal(payload.context.feelsLike, "31°C");
  assert.match(payload.message, /🫠体感温度：31°C/);
});

test("accepts shortcut-friendly flat person fields for the full message", () => {
  const payload = buildMessagePayload(
    {
      date: "2026-06-23",
      location: "中国\n浙江省\n杭州市 西湖区\n文三路",
      weather: "多云",
      loveStart: "2026-06-20",
      person1Name: "小鹿",
      person1Birthday: "08-16",
      person1Emoji: "🦌",
      person2Name: "星河",
      person2Birthday: "11-03",
      person2Emoji: "🌙"
    },
    {
      quote: {
        en: "A steady love makes ordinary days bright.",
        zh: "稳定的爱让普通日子也发光。"
      },
      quoteSource: "test"
    }
  );

  assert.deepEqual(payload.people.map((person) => person.name), ["小鹿", "星河"]);
  assert.deepEqual(payload.people.map((person) => person.emoji), ["🦌", "🌙"]);
  assert.equal(payload.context.city, "杭州市");
});

test("accepts keyed person dictionaries for the full message", () => {
  const payload = buildMessagePayload(
    {
      date: "2026-06-23",
      loveStart: "2026-06-20",
      people: {
        person1: { name: "小鹿", birthday: "08-16" },
        person2: { name: "星河", birthday: "11-03" }
      }
    },
    {
      quote: {
        en: "A steady love makes ordinary days bright.",
        zh: "稳定的爱让普通日子也发光。"
      },
      quoteSource: "test"
    }
  );

  assert.deepEqual(payload.people.map((person) => person.name), ["小鹿", "星河"]);
});
