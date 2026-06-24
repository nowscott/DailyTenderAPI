export const homepageStyles = `
:root {
  --dt-ink: #192124;
  --dt-muted: #66777c;
  --dt-teal: #135b78;
  --dt-teal-dark: #0f5d5a;
  --dt-cream: #fff8ea;
  --dt-line: rgba(25, 33, 36, 0.12);
}

body {
  color: var(--dt-ink);
  background: #fffaf1;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.navbar {
  backdrop-filter: blur(18px);
  background: rgba(255, 250, 241, 0.88);
  border-bottom: 1px solid var(--dt-line);
}

.brand-mark {
  width: 2.25rem;
  height: 2.25rem;
  display: inline-grid;
  place-items: center;
  border-radius: 0.75rem;
  background: var(--dt-teal);
  color: #fff;
  font-weight: 800;
}

.hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 20%, rgba(20, 123, 120, 0.2), transparent 32rem),
    linear-gradient(135deg, #fff8ea 0%, #e9f7f3 48%, #ffe9d2 100%);
  border-bottom: 1px solid var(--dt-line);
}

.hero h1 {
  letter-spacing: 0;
}

.hero-card,
.soft-card {
  border: 1px solid var(--dt-line);
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 1.25rem 3.5rem rgba(25, 33, 36, 0.12);
}

.soft-card {
  background: #fff;
  box-shadow: 0 1rem 2rem rgba(25, 33, 36, 0.06);
}

.btn-primary {
  --bs-btn-bg: var(--dt-teal);
  --bs-btn-border-color: var(--dt-teal);
  --bs-btn-hover-bg: var(--dt-teal-dark);
  --bs-btn-hover-border-color: var(--dt-teal-dark);
  --bs-btn-active-bg: var(--dt-teal-dark);
  --bs-btn-active-border-color: var(--dt-teal-dark);
}

.text-teal {
  color: var(--dt-teal-dark);
}

.bg-teal-subtle {
  background: #dff4ee;
}

.endpoint {
  overflow-wrap: anywhere;
}

.step-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: inline-grid;
  place-items: center;
  border-radius: 0.875rem;
  background: #dff4ee;
  color: var(--dt-teal-dark);
}

textarea,
pre {
  min-height: 24rem;
  max-width: 100%;
  border-radius: 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem !important;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

textarea.form-control {
  white-space: pre;
  overflow: auto;
  overflow-wrap: normal;
  word-break: normal;
  tab-size: 2;
}

textarea.form-control,
pre.code-pane {
  background: #11181a;
  color: #f8f4ea;
  border-color: #263335;
}

pre.code-pane {
  white-space: pre-wrap;
  padding: 1rem;
  margin: 0;
  overflow: auto;
}

.message-preview {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.table {
  table-layout: fixed;
}

.table td,
.table th {
  overflow-wrap: anywhere;
}

.copy-status {
  min-height: 1.5rem;
}

@media (max-width: 575.98px) {
  textarea,
  pre {
    min-height: 18rem;
    font-size: 0.8125rem !important;
  }

  .hero {
    text-align: left;
  }
}
`;

export const homepageScript = `
const samplePayload = {
  date: "2026-06-23",
  week: "星期二",
  location: "中国\\n浙江省\\n杭州市 西湖区\\n文三路",
  weather: "晴间多云",
  feelsLike: "29°C",
  rainProbability: "35",
  loveStart: "2022-05-20",
  greetingName: "小鹿",
  closingText: "今天也要记得好好吃饭哦！",
  people: [
    { name: "小鹿", birthday: "08-16", emoji: "🦌" },
    { name: "星河", birthday: "11-03", emoji: "🌙" }
  ]
};

const requestInput = document.querySelector("#request-json");
const responseOutput = document.querySelector("#response-output");
const messagePreview = document.querySelector("#message-preview");
const statusLine = document.querySelector("#status-line");
const endpoint = document.querySelector("#endpoint-text");

requestInput.value = JSON.stringify(samplePayload, null, 2);
messagePreview.textContent = "点击运行接口后，这里会显示可直接发送的 message。";
responseOutput.textContent = "接口完整响应会显示在这里。";

document.querySelector("#run-request").addEventListener("click", runRequest);
document.querySelector("#reset-sample").addEventListener("click", () => {
  requestInput.value = JSON.stringify(samplePayload, null, 2);
  setStatus("示例 JSON 已重置。");
});
document.querySelector("#copy-message").addEventListener("click", () => copyText(messagePreview.textContent, "已复制 message。"));
document.querySelector("#copy-endpoint").addEventListener("click", () => copyText(endpoint.textContent, "已复制接口地址。"));
document.querySelector("#copy-curl").addEventListener("click", () => copyText(document.querySelector("#curl-example").textContent, "已复制 curl 示例。"));

async function runRequest() {
  setStatus("正在调用接口...");

  let payload;
  try {
    payload = JSON.parse(requestInput.value);
  } catch {
    setStatus("JSON 格式不正确，请先修正。", true);
    return;
  }

  try {
    const response = await fetch("/api/message", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await response.json();
    responseOutput.textContent = JSON.stringify(json, null, 2);
    messagePreview.textContent = json.message || "";

    if (!response.ok) {
      setStatus(json.message || "接口返回错误。", true);
      return;
    }

    setStatus("调用成功，可以复制 message。");
  } catch {
    setStatus("请求失败，请检查网络或本地服务。", true);
  }
}

async function copyText(text, successText) {
  try {
    await navigator.clipboard.writeText(text);
    setStatus(successText);
  } catch {
    setStatus("复制失败，请手动选择复制。", true);
  }
}

function setStatus(text, isError = false) {
  statusLine.textContent = text;
  statusLine.classList.toggle("text-danger", isError);
  statusLine.classList.toggle("text-secondary", !isError);
}
`;

export function renderHomePage() {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DailyTenderAPI - iOS 快捷指令每日问候接口</title>
    <meta
      name="description"
      content="DailyTenderAPI 帮 iOS 快捷指令生成每日问候消息，包含天气、恋爱天数、生日倒计时和每日英文短句。"
    />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <nav class="navbar navbar-expand-lg sticky-top">
      <div class="container py-2">
        <a class="navbar-brand d-flex align-items-center gap-2 fw-bold" href="/">
          <span class="brand-mark">DT</span>
          <span>DailyTenderAPI</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topNav" aria-controls="topNav" aria-expanded="false" aria-label="切换导航">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="topNav">
          <div class="navbar-nav ms-auto gap-lg-2">
            <a class="nav-link" href="#tester">在线测试</a>
            <a class="nav-link" href="#shortcut">快捷指令</a>
            <a class="nav-link" href="#reference">字段说明</a>
            <a class="nav-link" href="https://github.com/nowscott/DailyTenderAPI">GitHub</a>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <section class="hero">
        <div class="container py-5 py-lg-6">
          <div class="row align-items-center g-4 g-xl-5">
            <div class="col-lg-6">
              <span class="badge rounded-pill bg-teal-subtle text-teal mb-3">
                <i class="bi bi-sunrise me-1"></i> iOS Shortcuts Message API
              </span>
              <h1 class="display-3 fw-bold mb-4">把每日问候消息交给一个稳定接口生成。</h1>
              <p class="lead text-secondary mb-4">
                快捷指令只负责采集日期、天气和位置；DailyTenderAPI 负责计算恋爱天数、生日倒计时、每日短句，并返回可直接发送的 message。
              </p>
              <div class="d-flex flex-column flex-sm-row gap-2 align-items-stretch align-items-sm-center mb-4">
                <code class="endpoint bg-white border rounded-3 px-3 py-2" id="endpoint-text">https://dtn.0211120.xyz/api/message</code>
                <button class="btn btn-outline-secondary" id="copy-endpoint" type="button">
                  <i class="bi bi-copy me-1"></i>复制
                </button>
              </div>
              <div class="row g-3">
                <div class="col-sm-4">
                  <div class="soft-card h-100 p-3">
                    <span class="step-icon mb-3"><i class="bi bi-geo-alt"></i></span>
                    <h2 class="h6 fw-bold">采集数据</h2>
                    <p class="small text-secondary mb-0">日期、星期、位置、天气、体感温度和降雨概率。</p>
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="soft-card h-100 p-3">
                    <span class="step-icon mb-3"><i class="bi bi-gear"></i></span>
                    <h2 class="h6 fw-bold">接口计算</h2>
                    <p class="small text-secondary mb-0">城市解析、恋爱天数、生日倒计时和每日短句。</p>
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="soft-card h-100 p-3">
                    <span class="step-icon mb-3"><i class="bi bi-chat-heart"></i></span>
                    <h2 class="h6 fw-bold">直接发送</h2>
                    <p class="small text-secondary mb-0">从响应词典取出 message，交给发送信息动作。</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-6" id="tester">
              <div class="hero-card overflow-hidden">
                <div class="bg-dark text-white p-3 d-flex flex-column flex-sm-row gap-2 align-items-sm-center justify-content-between">
                  <div class="fw-bold"><i class="bi bi-circle-fill text-success small me-2"></i>Live API Tester</div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-light btn-sm" id="reset-sample" type="button">
                      <i class="bi bi-arrow-counterclockwise me-1"></i>示例
                    </button>
                    <button class="btn btn-primary btn-sm" id="run-request" type="button">
                      <i class="bi bi-play-fill me-1"></i>运行
                    </button>
                  </div>
                </div>
                <div class="p-3 p-md-4">
                  <div class="row g-3">
                    <div class="col-xl-6">
                      <label class="form-label fw-semibold" for="request-json">请求 JSON</label>
                      <textarea class="form-control" id="request-json" spellcheck="false"></textarea>
                    </div>
                    <div class="col-xl-6">
                      <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <label class="form-label fw-semibold mb-0" for="message-preview">返回 message</label>
                        <button class="btn btn-outline-secondary btn-sm" id="copy-message" type="button">
                          <i class="bi bi-copy me-1"></i>复制
                        </button>
                      </div>
                      <pre class="code-pane" id="message-preview" aria-live="polite"></pre>
                    </div>
                    <div class="col-12">
                      <label class="form-label fw-semibold" for="response-output">完整响应</label>
                      <pre class="code-pane" id="response-output" aria-live="polite"></pre>
                      <div class="copy-status small text-secondary mt-2" id="status-line">编辑 JSON 后点击运行接口。</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5" id="shortcut">
        <div class="container">
          <div class="row mb-4">
            <div class="col-lg-7">
              <h2 class="display-6 fw-bold">快捷指令只需要 4 步</h2>
              <p class="text-secondary mb-0">保持手机端流程简单，所有文本拼接逻辑都放在服务端，后续调整模板不需要重做快捷指令。</p>
            </div>
          </div>
          <div class="row g-3">
            ${renderStep("01", "格式化日期", "用当前日期生成 yyyy-MM-dd，再生成星期文本，例如 星期二。", "calendar3")}
            ${renderStep("02", "获取天气", "获取当前位置天气，提取天气状况、体感温度、降雨概率和位置文本。", "cloud-sun")}
            ${renderStep("03", "创建词典", "把日期、天气、恋爱开始日、两个人生日和 emoji 放进 JSON 词典。", "braces")}
            ${renderStep("04", "发送 message", "获取 URL 内容后，从返回词典取 message，直接交给发送信息动作。", "send")}
          </div>
        </div>
      </section>

      <section class="py-5 bg-light border-top border-bottom" id="reference">
        <div class="container">
          <div class="row mb-4">
            <div class="col-lg-7">
              <h2 class="display-6 fw-bold">最小可用请求</h2>
              <p class="text-secondary mb-0">如果快捷指令的 people 数组不好配置，也可以使用 person1Name/person2Name 这类扁平字段。</p>
            </div>
          </div>
          <div class="row g-4">
            <div class="col-lg-6">
              <div class="soft-card p-3 h-100">
                <div class="table-responsive">
                  <table class="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>字段</th>
                        <th>用途</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td><code>date</code></td><td>yyyy-MM-dd 日期，缺省时按 Asia/Shanghai 的今天计算。</td></tr>
                      <tr><td><code>location</code></td><td>快捷指令位置转文本的原始内容，服务端会提取城市。</td></tr>
                      <tr><td><code>loveStart</code></td><td>恋爱开始日期，默认按日期差计算第几天。</td></tr>
                      <tr><td><code>people[].emoji</code></td><td>每个人生日倒计时行前面的 emoji。</td></tr>
                      <tr><td><code>greetingName</code></td><td>第一行问候称呼，例如 小鹿。</td></tr>
                      <tr><td><code>closingText</code></td><td>每日提醒文案，例如 今天也要记得好好吃饭哦！</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <pre class="code-pane h-100" id="curl-example">curl -X POST "https://dtn.0211120.xyz/api/message" \\
  -H "content-type: application/json" \\
  -d '{"date":"2026-06-23","week":"星期二","location":"中国\\n浙江省\\n杭州市 西湖区\\n文三路","weather":"晴间多云","feelsLike":"29°C","rainProbability":"35","loveStart":"2022-05-20","greetingName":"小鹿","closingText":"今天也要记得好好吃饭哦！","people":[{"name":"小鹿","birthday":"08-16","emoji":"🦌"},{"name":"星河","birthday":"11-03","emoji":"🌙"}]}'</pre>
              <button class="btn btn-outline-secondary w-100 mt-3" id="copy-curl" type="button">
                <i class="bi bi-copy me-1"></i>复制 curl
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5">
        <div class="container">
          <div class="row align-items-start g-4">
            <div class="col-lg-5">
              <h2 class="display-6 fw-bold">返回文本预览</h2>
              <p class="text-secondary">接口返回的 message 保留换行，快捷指令端取出后可以直接发送。</p>
            </div>
            <div class="col-lg-7">
              <div class="soft-card p-4 message-preview">🌞早安吖小鹿
📆2026年06月23日 星期二
🏡城市：杭州市
🌤️天气：晴间多云
🫠体感温度：29°C
☔️降雨概率：35%
💖今天是我们恋爱的第1495天
🦌距离小鹿生日还有54天
🌙距离星河生日还有133天
🥰今天也要记得好好吃饭哦！

You needn't be born radiant, but you can keep shining.
你不必天生闪耀，但可以持续发光。</div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-top py-4">
      <div class="container d-flex flex-column flex-sm-row gap-2 align-items-sm-center justify-content-between text-secondary small">
        <span>DailyTenderAPI v0.2.1</span>
        <a href="https://github.com/nowscott/DailyTenderAPI">GitHub</a>
      </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/app.js"></script>
  </body>
</html>`;
}

function renderStep(index, title, body, icon) {
  return `<div class="col-md-6 col-xl-3">
    <article class="soft-card h-100 p-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <span class="text-danger fw-bold">${index}</span>
        <span class="step-icon"><i class="bi bi-${icon}"></i></span>
      </div>
      <h3 class="h5 fw-bold">${title}</h3>
      <p class="text-secondary mb-0">${body}</p>
    </article>
  </div>`;
}
