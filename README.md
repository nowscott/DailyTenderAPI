# DailyTenderAPI

`DailyTenderAPI` 是给 iOS 快捷指令调用的每日问候文案辅助接口项目。

Production: `https://dtn.0211120.xyz`

Current version: `0.1.3`

## 命名

- 项目名：`DailyTenderAPI`
- 网站前缀：`daily-tender`
- 建议域名形式：`daily-tender.example.com`
- Git 仓库名建议：`DailyTenderAPI`
- Vercel 项目名建议：`daily-tender`

域名前缀推荐使用 `daily-tender`。它比 `daily-tender-api` 更适合快捷指令访问：短、清晰，而且不会把实现方式固定成 API 项目；如果 Vercel 项目名或子域名已被占用，再使用 `daily-tender-api` 作为备选。

## 设计边界

快捷指令继续负责：

- 获取当天日期、星期、城市、天气、体感温度和降雨概率。
- 把这些原始数据用 JSON 传给接口。
- 发送接口返回的最终消息。
- 保留可在手机上临时调整的称呼、语气和固定句子。

网页接口负责：

- 计算恋爱纪念日天数。
- 计算两个生日倒计时。
- 返回每日英文短句和中文翻译。
- 生成完整最终消息，降低快捷指令里的条件判断、日期计算和文本拼接复杂度。

## 推荐接口

`POST /api/message`

快捷指令把已获取到的天气、日期和两个人信息传给接口；接口返回可直接发送的 `message`，并同时保留结构化字段便于调试。

示例请求：

```bash
curl -X POST "http://localhost:3000/api/message" \
  -H "content-type: application/json" \
  -d '{
    "date": "2026-06-23",
    "week": "星期二",
    "location": "中国\n浙江省\n杭州市 西湖区\n文三路",
    "weather": "多云",
    "feelsLike": "32°C",
    "rainProbability": "40%",
    "loveStart": "2022-05-20",
    "greetingName": "小鹿",
    "closingText": "今天也要记得好好吃饭哦！",
    "people": [
      { "name": "小鹿", "birthday": "08-16", "emoji": "🦌" },
      { "name": "星河", "birthday": "11-03", "emoji": "🌙" }
    ]
  }'
```

返回示例：

```json
{
  "date": "2026-06-23",
  "loveDays": 1684,
  "person1BirthdayDays": 349,
  "person2BirthdayDays": 291,
  "people": [
    {
      "key": "person1",
      "name": "小鹿",
      "birthday": "08-16",
      "birthdayDays": 349,
      "nextBirthday": "2027-08-16",
      "emoji": "🦌"
    },
    {
      "key": "person2",
      "name": "星河",
      "birthday": "11-03",
      "birthdayDays": 291,
      "nextBirthday": "2027-11-03",
      "emoji": "🌙"
    }
  ],
  "quote": {
    "en": "You needn't be born radiant, but you can keep shining.",
    "zh": "你不必天生闪耀，但可以持续发光。"
  },
  "quoteSource": "iciba",
  "message": "🌞早安吖小鹿\n📆2026年06月23日 星期二\n🏡城市：杭州市\n🌤️天气：多云\n🫠体感温度：32°C\n☔️降雨概率：40%\n💖今天是我们恋爱的第1684天\n🦌距离小鹿生日还有349天\n🌙距离星河生日还有291天\n🥰今天也要记得好好吃饭哦！\n\nYou needn't be born radiant, but you can keep shining.\n你不必天生闪耀，但可以持续发光。"
}
```

### JSON 参数

| 参数 | 必填 | 格式 | 说明 |
| --- | --- | --- | --- |
| `date` | 否 | `YYYY-MM-DD` | 要计算的日期；不传时按 `Asia/Shanghai` 的今天计算。 |
| `week` | 否 | 文本 | 星期文本，例如 `星期二`。 |
| `city` | 否 | 文本 | 城市；如果传了会优先使用。 |
| `location` / `locationText` / `address` | 否 | 文本 | iOS 快捷指令“位置转文本”的原始结果；未传 `city` 时服务端会从这里提取城市。 |
| `weather` | 否 | 文本 | 天气。 |
| `temperature` | 否 | 文本 | 气温文本；可选。 |
| `feelsLike` | 否 | 文本 | 体感温度。 |
| `rainProbability` | 否 | 文本 | 降雨概率。 |
| `loveStart` / `loveStartDate` | 是 | `YYYY-MM-DD` | 恋爱开始日期。默认按日期差计算恋爱天数。 |
| `loveCountRule` | 否 | `exclusive` / `inclusive` | 默认 `exclusive`，即日期差；如需包含开始当天，传 `inclusive`。 |
| `greetingName` | 否 | 文本 | 顶部问候称呼，默认第一个人的 `name`。 |
| `greetingText` | 否 | 文本 | 顶部问候文字，默认 `早安吖`。 |
| `closingText` | 否 | 文本 | 结尾提醒文字，默认 `今天也要记得好好吃饭哦！`。 |
| `emojis` | 否 | 对象 | 可覆盖标题、日期、城市、天气、恋爱天数等行的 emoji。 |
| `people` | 是 | 数组 | 必须正好两个人，每项包含 `name` 和 `birthday`。 |
| `people[].name` | 是 | 文本 | 称呼，由快捷指令传入。 |
| `people[].birthday` | 是 | `MM-DD` | 生日。 |
| `people[].emoji` | 否 | 文本 | 该人的生日倒计时 emoji，例如 `🦌`、`🌙`。 |
| `person1Name` / `person1Birthday` | 否 | 文本 / `MM-DD` | 快捷指令不方便传 `people` 数组时使用。 |
| `person2Name` / `person2Birthday` | 否 | 文本 / `MM-DD` | 快捷指令不方便传 `people` 数组时使用。 |
| `person1Emoji` / `person2Emoji` | 否 | 文本 | 快捷指令使用扁平字段时传入对应 emoji。 |
| `quote` | 否 | 对象 | 可直接传 `{ "en": "...", "zh": "..." }` 覆盖每日一句。 |
| `quoteSource` | 否 | `iciba` / `local` | 默认 `iciba`，失败时自动回退本地句库。 |

每日一句逻辑来自 AutoCare 里的词霸每日金句方案：请求 `http://open.iciba.com/dsapi/`，英文使用 `content`，中文使用 `note`。如果词霸接口不可用，DailyTenderAPI 会自动使用本地短句库。

## 结构化接口

`GET /api/daily`

这个接口保留给只想获取结构化数据、仍由快捷指令自己拼文案的场景。两个人的称呼也作为传输数据的一部分，不在服务端硬编码。

示例请求：

```text
GET /api/daily?date=2026-06-23&loveStart=2021-10-01&person1Name=Person%20A&person1Birthday=05-20&person2Name=Person%20B&person2Birthday=12-01
```

返回示例：

```json
{
  "date": "2026-06-23",
  "timeZone": "Asia/Shanghai",
  "names": {
    "person1": "Person A",
    "person2": "Person B"
  },
  "loveDays": 1684,
  "person1BirthdayDays": 331,
  "person2BirthdayDays": 161,
  "people": [
    {
      "key": "person1",
      "name": "Person A",
      "birthday": "05-20",
      "birthdayDays": 331,
      "nextBirthday": "2027-05-20"
    },
    {
      "key": "person2",
      "name": "Person B",
      "birthday": "12-01",
      "birthdayDays": 161,
      "nextBirthday": "2026-12-01"
    }
  ],
  "quote": {
    "en": "You needn't be born radiant, but you can keep shining.",
    "zh": "你不必天生闪耀，但可以持续发光。"
  }
}
```

## 请求参数

| 参数 | 必填 | 格式 | 说明 |
| --- | --- | --- | --- |
| `date` | 否 | `YYYY-MM-DD` | 要计算的日期；不传时按 `Asia/Shanghai` 的今天计算。 |
| `loveStart` / `loveStartDate` | 是 | `YYYY-MM-DD` | 恋爱开始日期。默认按日期差计算恋爱天数。 |
| `person1Name` | 是 | 文本 | 第一个人的称呼，由快捷指令传入。 |
| `person1Birthday` | 是 | `MM-DD` | 第一个人的生日。 |
| `person2Name` | 是 | 文本 | 第二个人的称呼，由快捷指令传入。 |
| `person2Birthday` | 是 | `MM-DD` | 第二个人的生日。 |
| `timeZone` | 否 | IANA 时区 | 默认 `Asia/Shanghai`。 |
| `quoteMode` | 否 | `daily` / `random` | 默认 `daily`，同一天稳定返回同一句。 |

服务端也支持 `.env` 环境变量作为兜底配置，见 `.env.example`。但为了避免把私人称呼固定写死，更推荐快捷指令每次请求时传入 `person1Name` 和 `person2Name`。

## 本地运行

```bash
npm test
npm start
```

本地验证结构化接口：

```bash
curl "http://localhost:3000/api/daily?date=2026-06-23&loveStart=2021-10-01&person1Name=Person%20A&person1Birthday=05-20&person2Name=Person%20B&person2Birthday=12-01"
```

本地验证完整消息接口：

```bash
curl -X POST "http://localhost:3000/api/message" \
  -H "content-type: application/json" \
  -d '{"date":"2026-06-23","week":"星期二","location":"中国\n浙江省\n杭州市 西湖区\n文三路","weather":"多云","feelsLike":"32°C","rainProbability":"40","loveStart":"2022-05-20","greetingName":"小鹿","closingText":"今天也要记得好好吃饭哦！","people":[{"name":"小鹿","birthday":"08-16","emoji":"🦌"},{"name":"星河","birthday":"11-03","emoji":"🌙"}]}'
```

## 部署到 Vercel

项目已经包含 Vercel API Routes：

- `api/message.js` -> `POST /api/message`
- `api/daily.js` -> `GET /api/daily`
- `api/health.js` -> `GET /api/health`

当前对外域名前缀：`dtn`，完整域名为 `dtn.0211120.xyz`。

Vercel 项目名仍可使用 `daily-tender`，对外访问使用自定义域名：

```bash
npx vercel --prod
```

当前项目已部署到：

`https://dtn.0211120.xyz`

建议在 Vercel 项目环境变量中设置：

| 变量 | 建议值 | 说明 |
| --- | --- | --- |
| `TIME_ZONE` | `Asia/Shanghai` | 不传 `date` 时用于取今天。 |
| `QUOTE_SOURCE` | `iciba` | 默认词霸每日金句；失败自动回退本地短句。 |

部署后验证：

```bash
curl "https://你的域名/api/health"

curl -X POST "https://你的域名/api/message" \
  -H "content-type: application/json" \
  -d '{"date":"2026-06-23","week":"星期二","location":"中国\n浙江省\n杭州市 西湖区\n文三路","weather":"多云","feelsLike":"32°C","rainProbability":"40","loveStart":"2022-05-20","greetingName":"小鹿","closingText":"今天也要记得好好吃饭哦！","people":[{"name":"小鹿","birthday":"08-16","emoji":"🦌"},{"name":"星河","birthday":"11-03","emoji":"🌙"}]}'
```

## iOS 快捷指令结构

推荐快捷指令只做“采集数据 + 调接口 + 发送结果”。

1. 获取当前日期

   - 动作：`当前日期`
   - 动作：`格式化日期`
   - 格式：`自定义`
   - 格式字符串：`yyyy-MM-dd`
   - 保存为变量：`date`

2. 获取星期

   - 对同一个当前日期再执行一次 `格式化日期`
   - 格式字符串：`EEEE`
   - 如果系统输出是英文，可在快捷指令里映射成 `星期一` 到 `星期日`
   - 保存为变量：`week`

3. 获取天气数据

   - 动作：`获取当前天气`
   - 取天气状况，保存为 `weather`
   - 取体感温度，保存为 `feelsLike`
   - 取降雨概率，保存为 `rainProbability`
   - 获取当前位置或天气里的位置
   - 动作：`文本`
   - 把位置变量放进文本动作，让快捷指令把位置转成文本
   - 保存为 `location`

   位置文本可以原样传给服务端，例如：

   ```text
   中国
   浙江省
   杭州市 西湖区
   文三路
   ```

   服务端会优先提取包含 `市` 的部分，以上示例会提取为 `杭州市`。如果你在快捷指令里能直接取到城市，也可以继续传 `city`，服务端会优先使用 `city`。

4. 准备固定个人数据

   - `loveStart`：恋爱开始日期，例如 `2022-05-20`
   - `people`：正好两个人，每个人包含：
     - `name`：访问接口时传入的称呼
     - `birthday`：`MM-DD` 格式生日，例如 `08-16`

5. 生成 JSON 请求体

   在快捷指令里用“词典”动作创建：

   ```json
   {
     "date": "date 变量",
     "week": "week 变量",
     "location": "location 变量",
     "weather": "weather 变量",
     "feelsLike": "feelsLike 变量",
     "rainProbability": "rainProbability 变量",
     "loveStart": "2022-05-20",
     "greetingName": "小鹿",
     "closingText": "今天也要记得好好吃饭哦！",
     "people": [
       {
         "name": "小鹿",
         "birthday": "08-16",
         "emoji": "🦌"
       },
       {
         "name": "星河",
         "birthday": "11-03",
         "emoji": "🌙"
       }
     ]
   }
   ```

   如果快捷指令发送后返回 `people must contain exactly two people`，说明嵌套列表没有按 JSON 数组发出去。此时可以改用更简单的扁平字段：

   ```json
   {
     "date": "date 变量",
     "week": "week 变量",
     "location": "location 变量",
     "weather": "weather 变量",
     "feelsLike": "feelsLike 变量",
     "rainProbability": "rainProbability 变量",
     "loveStart": "2022-05-20",
     "greetingName": "小鹿",
     "closingText": "今天也要记得好好吃饭哦！",
     "person1Name": "小鹿",
     "person1Birthday": "08-16",
     "person1Emoji": "🦌",
     "person2Name": "星河",
     "person2Birthday": "11-03",
     "person2Emoji": "🌙"
   }
   ```

6. 调用接口

   - 动作：`获取 URL 内容`
   - URL：`https://你的域名/api/message`
   - 方法：`POST`
   - 请求体：`JSON`
   - 请求体内容：上一步创建的词典

7. 读取结果并发送

   - 从返回的词典里取 `message`
   - 用“发送信息”或其他发送动作直接发送 `message`

调试时可以额外查看这些字段：`loveDays`、`person1BirthdayDays`、`person2BirthdayDays`、`quoteSource`。如果 `quoteSource` 是 `local-fallback`，说明词霸接口当次不可用，服务已自动使用本地短句。

## 后续待定

- 确认恋爱开始日期。
- 确认两个生日的月日。
- 真实称呼由快捷指令通过 `people` 传输，不在服务端硬编码。
- `POST /api/message` 默认使用词霸每日金句，失败时自动回退本地短句库。
- 确认部署位置和最终域名。

## License

MIT
