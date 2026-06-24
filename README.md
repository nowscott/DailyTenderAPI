# DailyTenderAPI：把每日问候从快捷指令里拆出来

DailyTenderAPI 是一个给 iOS 快捷指令调用的每日问候消息接口。

它把原本容易堆在快捷指令里的日期计算、生日倒计时、城市提取、每日短句和文本拼接放到服务端处理。手机端只负责采集当天的数据，然后把 JSON 发给接口；接口返回一段可以直接发送的 `message`。

线上地址：

- 主页与在线测试：`https://dtn.0211120.xyz`
- 推荐接口：`POST https://dtn.0211120.xyz/api/message`
- 健康检查：`GET https://dtn.0211120.xyz/api/health`

## 适合什么场景

如果你已经在用 iOS 快捷指令做每日问候，通常会遇到几个问题：

- 日期差、生日倒计时、星期和天气文本都写在快捷指令里，维护起来很碎。
- 快捷指令里拼多行消息不直观，稍微换个文案就要改很多动作。
- 每日一句、城市解析这类逻辑不应该固定在手机端。
- 两个人的称呼、生日、emoji 需要保留在请求里，而不是写死在服务端。

DailyTenderAPI 的边界很简单：快捷指令采集事实，接口生成消息。

## 它会返回什么

一次完整请求会返回结构化字段和最终消息。快捷指令里只需要取出 `message` 发送即可。

```text
🌞早安吖小鹿
📆2026年06月23日 星期二
🏡城市：杭州市
🌤️天气：晴间多云
🫠体感温度：29°C
☔️降雨概率：35%
💖今天是我们恋爱的第1495天
🦌距离小鹿生日还有54天
🌙距离星河生日还有133天
🥰今天也要记得好好吃饭哦！

May the day treat you kindly, and may you treat yourself kindly too.
愿今天善待你，也愿你同样善待自己。
```

## 最快试一次

本地运行后可以直接用下面的请求测试：

```bash
curl -X POST "http://localhost:3000/api/message" \
  -H "content-type: application/json" \
  -d '{
    "date": "2026-06-23",
    "week": "星期二",
    "location": "中国\n浙江省\n杭州市 西湖区\n文三路",
    "weather": "晴间多云",
    "feelsLike": "29°C",
    "rainProbability": "35",
    "loveStart": "2022-05-20",
    "greetingName": "小鹿",
    "closingText": "今天也要记得好好吃饭哦！",
    "quoteSource": "local",
    "people": [
      { "name": "小鹿", "birthday": "08-16", "emoji": "🦌" },
      { "name": "星河", "birthday": "11-03", "emoji": "🌙" }
    ]
  }'
```

几个细节：

- `rainProbability` 可以传 `35` 或 `35%`，服务端会补齐百分号。
- `location` 可以传 iOS 快捷指令“位置转文本”的原始结果，服务端会尽量提取城市。
- `quoteSource` 默认是 `iciba`；示例里用 `local` 是为了让测试结果不依赖远程接口。

## 快捷指令怎么接

推荐把快捷指令压缩成 4 个动作区块。

### 1. 采集日期、天气和位置

在快捷指令里准备这些变量：

| 变量 | 示例 | 说明 |
| --- | --- | --- |
| `date` | `2026-06-23` | 当前日期，格式为 `yyyy-MM-dd`。 |
| `week` | `星期二` | 当前星期；如果系统输出英文，可在快捷指令里映射。 |
| `weather` | `晴间多云` | 天气状况。 |
| `feelsLike` | `29°C` | 体感温度。 |
| `rainProbability` | `35` | 降雨概率，是否带 `%` 都可以。 |
| `location` | `中国\n浙江省\n杭州市 西湖区\n文三路` | 位置文本；能直接拿到城市时也可以传 `city`。 |

位置文本不需要在快捷指令里拆得很细。下面两种都可以被识别为 `杭州市`：

```text
中国
浙江省
杭州市 西湖区
文三路
```

```text
中国
浙江省杭州市西湖区文三路
```

### 2. 准备固定个人数据

最推荐使用 `people` 数组。它正好包含两个人，每个人写 `name`、`birthday` 和可选的 `emoji`。

```json
{
  "loveStart": "2022-05-20",
  "people": [
    { "name": "小鹿", "birthday": "08-16", "emoji": "🦌" },
    { "name": "星河", "birthday": "11-03", "emoji": "🌙" }
  ]
}
```

如果 iOS 快捷指令不方便发送数组，可以改用扁平字段：

```json
{
  "person1Name": "小鹿",
  "person1Birthday": "08-16",
  "person1Emoji": "🦌",
  "person2Name": "星河",
  "person2Birthday": "11-03",
  "person2Emoji": "🌙"
}
```

### 3. 调用接口

使用“获取 URL 内容”动作：

- URL：`https://dtn.0211120.xyz/api/message`
- 方法：`POST`
- 请求体：`JSON`
- 请求内容：上面准备好的日期、天气、位置和个人数据词典。

### 4. 发送结果

接口返回后，从词典里取 `message`，交给“发送信息”或其他发送动作。

调试时可以顺手看这些字段：

- `loveDays`：恋爱天数。
- `person1BirthdayDays` / `person2BirthdayDays`：生日倒计时。
- `quoteSource`：每日一句来源；如果是 `iciba-cache`，说明使用了仓库里按日期留存的词霸短句；如果是 `local-fallback`，说明远程短句当次不可用，服务已自动回退。

## API 说明

### POST /api/message

这个接口面向快捷指令使用。它接收当天上下文和两个人的信息，返回完整 `message`。

#### 请求字段

| 参数 | 必填 | 格式 | 说明 |
| --- | --- | --- | --- |
| `date` | 否 | `YYYY-MM-DD` | 要计算的日期；不传时按 `Asia/Shanghai` 的今天计算。 |
| `week` | 否 | 文本 | 星期文本，例如 `星期二`。 |
| `city` | 否 | 文本 | 城市；如果传了会优先使用。 |
| `location` / `locationText` / `address` | 否 | 文本 | iOS 快捷指令“位置转文本”的原始结果；未传 `city` 时服务端会提取城市。 |
| `weather` | 否 | 文本 | 天气。 |
| `feelsLike` | 否 | 文本 | 体感温度。 |
| `rainProbability` | 否 | 文本 | 降雨概率。 |
| `loveStart` / `loveStartDate` | 是 | `YYYY-MM-DD` | 恋爱开始日期。 |
| `loveCountRule` | 否 | `exclusive` / `inclusive` | 默认 `exclusive`，即日期差；传 `inclusive` 会包含开始当天。 |
| `greetingName` | 否 | 文本 | 顶部问候称呼，默认第一个人的 `name`。 |
| `greetingText` | 否 | 文本 | 顶部问候文字，默认 `早安吖`。 |
| `closingText` | 否 | 文本 | 结尾提醒文案。 |
| `emojis` | 否 | 对象 | 覆盖问候、日期、城市、天气、恋爱天数等行的 emoji。 |
| `people` | 是 | 数组或对象 | 推荐传正好两个人；也支持 `people.person1` / `people.person2`。 |
| `people[].name` | 是 | 文本 | 称呼，由快捷指令传入。 |
| `people[].birthday` | 是 | `MM-DD` | 生日。 |
| `people[].emoji` | 否 | 文本 | 生日倒计时行前面的 emoji。 |
| `person1Name` / `person1Birthday` | 否 | 文本 / `MM-DD` | 不方便传 `people` 时使用。 |
| `person2Name` / `person2Birthday` | 否 | 文本 / `MM-DD` | 不方便传 `people` 时使用。 |
| `person1Emoji` / `person2Emoji` | 否 | 文本 | 扁平字段模式下的 emoji。 |
| `quote` | 否 | 对象 | 传 `{ "en": "...", "zh": "..." }` 可覆盖每日一句。 |
| `quoteSource` | 否 | `iciba` / `local` | 默认 `iciba`，失败时自动回退本地短句。 |
| `timeZone` | 否 | IANA 时区 | 默认 `Asia/Shanghai`。 |

#### 返回字段

| 字段 | 说明 |
| --- | --- |
| `date` | 实际参与计算的日期。 |
| `loveDays` | 恋爱天数。 |
| `people` | 两个人的生日倒计时、下一次生日和 emoji。 |
| `quote` | 英文短句和中文翻译。 |
| `quoteSource` | `iciba-cache`、`iciba`、`local`、`local-fallback` 或 `provided`。 |
| `context` | 城市、天气、体感温度、降雨概率等中间上下文。 |
| `message` | 可以直接发送的最终文本。 |

### GET /api/daily

这个接口只返回结构化数据，适合仍想在快捷指令里自己拼文案的情况。

```text
GET /api/daily?date=2026-06-23&loveStart=2022-05-20&person1Name=Person%20A&person1Birthday=08-16&person2Name=Person%20B&person2Birthday=11-03
```

请求字段：

| 参数 | 必填 | 格式 | 说明 |
| --- | --- | --- | --- |
| `date` | 否 | `YYYY-MM-DD` | 要计算的日期；不传时按 `Asia/Shanghai` 的今天计算。 |
| `loveStart` / `loveStartDate` | 是 | `YYYY-MM-DD` | 恋爱开始日期。 |
| `person1Name` | 是 | 文本 | 第一个人的称呼。 |
| `person1Birthday` | 是 | `MM-DD` | 第一个人的生日。 |
| `person2Name` | 是 | 文本 | 第二个人的称呼。 |
| `person2Birthday` | 是 | `MM-DD` | 第二个人的生日。 |
| `timeZone` | 否 | IANA 时区 | 默认 `Asia/Shanghai`。 |
| `quoteMode` | 否 | `daily` / `random` | 默认 `daily`，同一天稳定返回同一句。 |

### GET /api/health

健康检查接口，用于部署后确认服务是否正常响应。

## 本地开发

```bash
npm test
npm start
```

默认监听 `http://localhost:3000`。如果端口被占用，可以临时换端口：

```bash
PORT=3001 npm start
```

本地检查建议跑这几项：

```bash
npm test
npm audit --omit=dev
git diff --check
```

## 部署到 Vercel

项目已经包含 Vercel API Routes：

- `api/message.js` -> `POST /api/message`
- `api/daily.js` -> `GET /api/daily`
- `api/health.js` -> `GET /api/health`

当前 Vercel 项目名使用 `daily-tender`，对外访问使用自定义域名 `dtn.0211120.xyz`。

```bash
npx vercel --prod
```

建议环境变量：

| 变量 | 建议值 | 说明 |
| --- | --- | --- |
| `TIME_ZONE` | `Asia/Shanghai` | 不传 `date` 时用于取今天。 |
| `QUOTE_SOURCE` | `iciba` | 默认词霸每日金句；失败自动回退本地短句。 |

部署后至少检查：

```bash
curl "https://dtn.0211120.xyz/api/health"
curl -I "https://dtn.0211120.xyz/icon.svg"
curl -I "https://dtn.0211120.xyz/site.webmanifest"
```

## 每日一句留存

项目使用 GitHub Actions 每天北京时间 00:30 抓取一次词霸每日一句，写入单一 JSON 文件：

```text
data/quotes/iciba.json
```

接口生成消息时会先按 `date` 查这个文件。命中时返回 `quoteSource: "iciba-cache"`；没有命中才请求词霸远程接口；远程不可用时再回退到本地短句库。

手动补某一天的数据：

```bash
QUOTE_DATE=2026-06-24 node scripts/fetch-iciba-quote.mjs
```

## 命名约定

- 项目名：`DailyTenderAPI`
- 网站前缀：`daily-tender`
- Vercel 项目名：`daily-tender`
- 当前生产域名：`dtn.0211120.xyz`

`daily-tender` 比 `daily-tender-api` 更适合放在域名或项目名里：它短一些，也不会把未来形态固定成“只有 API”。

## 常见问题

### 为什么 `people must contain exactly two people`？

`POST /api/message` 默认需要两个人。如果 iOS 快捷指令没有正确发出 JSON 数组，改用 `person1Name`、`person1Birthday`、`person2Name`、`person2Birthday` 这组扁平字段。

### 为什么 `quoteSource` 是 `local-fallback`？

默认每日一句优先使用 `data/quotes/iciba.json` 里的日期留存，然后才请求词霸接口：`https://open.iciba.com/dsapi/`。如果留存没有命中、远程接口当次也不可用，服务会自动回退到本地短句库。

### 为什么非法请求返回 400？

接口会校验 JSON body、日期、生日和时区。比如 `null`、数组、字符串 JSON、非法 `timeZone` 都会返回 `400 invalid_request`，这样快捷指令端能明确知道是请求参数问题。

## License

MIT
