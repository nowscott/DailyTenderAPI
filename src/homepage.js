import { SERVICE_VERSION } from "./version.js";

const SHORTCUT_IMPORT_URL = "https://www.icloud.com/shortcuts/622d4001eab1474dbb01722be82035cf";

export const homepageStyles = `
:root {
  color-scheme: light dark;
  --dt-ink: #30241e;
  --dt-muted: #765f50;
  --dt-accent: #6f4d2f;
  --dt-accent-dark: #4e3725;
  --dt-sage: #526e5a;
  --dt-red: #9c4f42;
  --dt-paper: #fbf1dc;
  --dt-paper-soft: #fff8eb;
  --dt-panel: #fff9ee;
  --dt-panel-strong: #f6e3c1;
  --dt-line: rgba(89, 62, 39, 0.24);
  --dt-shadow: rgba(87, 55, 31, 0.14);
  --dt-code-bg: #fff4df;
  --dt-code-ink: #342820;
  --dt-code-line: rgba(111, 77, 47, 0.34);
}

body {
  color: var(--dt-ink);
  background:
    linear-gradient(90deg, rgba(111, 77, 47, 0.045) 1px, transparent 1px),
    linear-gradient(0deg, rgba(111, 77, 47, 0.035) 1px, transparent 1px),
    var(--dt-paper);
  background-size: 2rem 2rem, 2rem 2rem, auto;
  font-family:
    "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia,
    "Songti SC", "Noto Serif SC", "Source Han Serif SC", SimSun, serif;
}

h1,
h2,
h3,
.navbar-brand {
  font-family:
    Georgia, "Times New Roman", "Songti SC", "Noto Serif SC",
    "Source Han Serif SC", SimSun, serif;
}

a {
  color: var(--dt-sage);
}

a:hover {
  color: var(--dt-accent);
}

body .text-secondary {
  color: var(--dt-muted) !important;
}

.navbar {
  backdrop-filter: blur(14px);
  background: rgba(255, 248, 235, 0.9);
  background: color-mix(in srgb, var(--dt-paper-soft) 90%, transparent);
  border-bottom: 1px solid var(--dt-line);
}

.navbar-brand,
.nav-link {
  color: var(--dt-ink);
}

.nav-link:hover,
.nav-link:focus {
  color: var(--dt-accent);
}

.brand-mark {
  width: 2.5rem;
  height: 2.5rem;
  display: inline-block;
  flex: 0 0 auto;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem var(--dt-shadow);
}

.brand-mark img {
  width: 100%;
  height: 100%;
  display: block;
}

.hero {
  position: relative;
  overflow: hidden;
  background:
    repeating-linear-gradient(135deg, rgba(111, 77, 47, 0.07) 0 1px, transparent 1px 12px),
    linear-gradient(180deg, #f9ecd2 0%, #f1ddb8 100%);
  border-bottom: 1px solid var(--dt-line);
}

.hero h1 {
  letter-spacing: 0;
}

.hero-card,
.soft-card {
  border: 1px solid var(--dt-line);
  border-radius: 0.5rem;
  background: var(--dt-panel);
  background: color-mix(in srgb, var(--dt-panel) 94%, transparent);
  box-shadow: 0 1rem 2.25rem var(--dt-shadow);
}

.soft-card {
  background: var(--dt-panel);
  box-shadow: 0 0.75rem 1.5rem rgba(87, 55, 31, 0.08);
}

.btn-primary {
  --bs-btn-bg: var(--dt-accent);
  --bs-btn-border-color: var(--dt-accent);
  --bs-btn-hover-bg: var(--dt-accent-dark);
  --bs-btn-hover-border-color: var(--dt-accent-dark);
  --bs-btn-active-bg: var(--dt-accent-dark);
  --bs-btn-active-border-color: var(--dt-accent-dark);
  --bs-btn-color: #fff8eb;
  --bs-btn-hover-color: #fff8eb;
}

.btn-outline-secondary {
  --bs-btn-color: var(--dt-accent);
  --bs-btn-border-color: rgba(111, 77, 47, 0.42);
  --bs-btn-hover-bg: var(--dt-accent);
  --bs-btn-hover-border-color: var(--dt-accent);
  --bs-btn-hover-color: #fff8eb;
  --bs-btn-active-bg: var(--dt-accent-dark);
  --bs-btn-active-border-color: var(--dt-accent-dark);
  --bs-btn-active-color: #fff8eb;
  background: var(--dt-panel);
  background: color-mix(in srgb, var(--dt-panel) 86%, transparent);
}

.tester-toolbar .btn-light {
  --bs-btn-bg: var(--dt-panel);
  --bs-btn-border-color: var(--dt-line);
  --bs-btn-color: var(--dt-accent);
  --bs-btn-hover-bg: var(--dt-panel-strong);
  --bs-btn-hover-border-color: var(--dt-line);
  --bs-btn-hover-color: var(--dt-accent-dark);
  --bs-btn-active-bg: var(--dt-panel-strong);
  --bs-btn-active-border-color: var(--dt-line);
  --bs-btn-active-color: var(--dt-accent-dark);
}

.text-danger {
  color: var(--dt-red) !important;
}

.text-teal {
  color: var(--dt-sage);
}

.bg-teal-subtle {
  background: #e6ddbf;
  border: 1px solid rgba(111, 77, 47, 0.2);
  color: var(--dt-sage);
  border-radius: 0.35rem;
}

.endpoint {
  color: var(--dt-accent-dark);
  background: var(--dt-panel) !important;
  border-color: var(--dt-line) !important;
  border-radius: 0.35rem !important;
  overflow-wrap: anywhere;
}

.step-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: inline-grid;
  place-items: center;
  border-radius: 0.35rem;
  background: var(--dt-panel-strong);
  color: var(--dt-sage);
  border: 1px solid rgba(111, 77, 47, 0.18);
}

.tester-section {
  background:
    linear-gradient(180deg, rgba(255, 248, 235, 0.62), rgba(246, 227, 193, 0.68));
  border-top: 1px solid var(--dt-line);
  border-bottom: 1px solid var(--dt-line);
}

.tester-toolbar {
  color: var(--dt-ink);
  background:
    repeating-linear-gradient(90deg, rgba(111, 77, 47, 0.09) 0 1px, transparent 1px 10px),
    var(--dt-panel-strong);
  border-bottom: 1px solid var(--dt-line);
}

.tester-toolbar .text-success {
  color: var(--dt-sage) !important;
}

.request-editor,
pre.code-pane {
  max-width: 100%;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem !important;
  line-height: 1.55;
}

.request-editor.form-control,
pre.code-pane {
  min-height: 24rem;
}

pre.code-pane {
  border-radius: 0.35rem;
  overflow-wrap: anywhere;
}

.request-editor.form-control {
  width: 100%;
  padding: 1rem;
  border-radius: 0.35rem;
  resize: vertical;
  white-space: pre;
  overflow: auto;
  overflow-wrap: normal;
  word-break: normal;
  tab-size: 2;
  box-shadow: inset 0 1px 0 rgba(111, 77, 47, 0.08);
}

.request-editor.form-control,
pre.code-pane {
  background: var(--dt-code-bg);
  color: var(--dt-code-ink);
  border: 1px solid var(--dt-code-line);
}

.request-editor.form-control:focus {
  background: var(--dt-code-bg);
  color: var(--dt-code-ink);
  border-color: var(--dt-sage);
  box-shadow:
    0 0 0 0.2rem rgba(82, 110, 90, 0.16),
    inset 0 1px 0 rgba(111, 77, 47, 0.08);
}

.request-editor.form-control::selection {
  background: rgba(169, 126, 73, 0.35);
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
  --bs-table-color: var(--dt-ink);
  --bs-table-bg: transparent;
  --bs-table-border-color: var(--dt-line);
}

.table td,
.table th {
  overflow-wrap: anywhere;
}

.table > :not(caption) > * > * {
  background-color: transparent;
  border-color: var(--dt-line);
}

.message-preview {
  font-family:
    "Iowan Old Style", "Palatino Linotype", Georgia, "Songti SC",
    "Noto Serif SC", SimSun, serif;
}

.copy-status {
  min-height: 1.5rem;
}

footer {
  background: rgba(255, 248, 235, 0.82);
  background: color-mix(in srgb, var(--dt-paper-soft) 82%, transparent);
  border-color: var(--dt-line) !important;
}

@media (prefers-color-scheme: dark) {
  :root {
    --dt-ink: #f0dfc6;
    --dt-muted: #c4ad91;
    --dt-accent: #d1a35f;
    --dt-accent-dark: #f0c980;
    --dt-sage: #9eb58f;
    --dt-red: #d38b78;
    --dt-paper: #19140f;
    --dt-paper-soft: #221a13;
    --dt-panel: #261d15;
    --dt-panel-strong: #302419;
    --dt-line: rgba(229, 199, 155, 0.22);
    --dt-shadow: rgba(0, 0, 0, 0.32);
    --dt-code-bg: #17120d;
    --dt-code-ink: #f4e6cf;
    --dt-code-line: rgba(229, 199, 155, 0.24);
  }

  body {
    background:
      linear-gradient(90deg, rgba(229, 199, 155, 0.035) 1px, transparent 1px),
      linear-gradient(0deg, rgba(229, 199, 155, 0.03) 1px, transparent 1px),
      var(--dt-paper);
  }

  .hero {
    background:
      repeating-linear-gradient(135deg, rgba(229, 199, 155, 0.055) 0 1px, transparent 1px 12px),
      linear-gradient(180deg, #241b13 0%, #1b1510 100%);
  }

  .navbar {
    background: rgba(34, 26, 19, 0.9);
    background: color-mix(in srgb, var(--dt-paper-soft) 90%, transparent);
  }

  .bg-teal-subtle {
    background: rgba(209, 163, 95, 0.16);
    border-color: rgba(229, 199, 155, 0.18);
    color: var(--dt-accent-dark);
  }

  .endpoint {
    color: var(--dt-accent-dark);
  }

  .tester-section {
    background:
      linear-gradient(180deg, rgba(34, 26, 19, 0.78), rgba(30, 23, 17, 0.86));
  }

  .tester-toolbar {
    background:
      repeating-linear-gradient(90deg, rgba(229, 199, 155, 0.055) 0 1px, transparent 1px 10px),
      var(--dt-panel-strong);
  }

  footer {
    background: rgba(34, 26, 19, 0.82);
    background: color-mix(in srgb, var(--dt-paper-soft) 82%, transparent);
  }

  .navbar-toggler {
    border-color: var(--dt-line);
  }

  .navbar-toggler-icon {
    filter: invert(1) sepia(0.35) saturate(0.65);
  }
}

@media (max-width: 575.98px) {
  .request-editor.form-control,
  pre.code-pane {
    min-height: 18rem;
    font-size: 0.8125rem !important;
  }

  .request-editor.form-control {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
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
  to: "小鹿",
  closingText: "今天也要记得好好吃饭哦！",
  people: [
    { name: "小鹿", birthday: "08-16", emoji: "🦌" },
    { name: "星河", birthday: "08-16", calendar: "lunar", emoji: "🌙" }
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
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#fbf1dc" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#19140f" media="(prefers-color-scheme: dark)" />
    <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    <link rel="manifest" href="/site.webmanifest" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <nav class="navbar navbar-expand-lg sticky-top">
      <div class="container py-2">
        <a class="navbar-brand d-flex align-items-center gap-2 fw-bold" href="/">
          <span class="brand-mark" aria-hidden="true"><img src="/icon.svg" alt="" /></span>
          <span>DailyTenderAPI</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topNav" aria-controls="topNav" aria-expanded="false" aria-label="切换导航">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="topNav">
          <div class="navbar-nav ms-auto gap-lg-2">
            <a class="nav-link" href="#shortcut">快捷指令</a>
            <a class="nav-link" href="#tester">在线测试</a>
            <a class="nav-link" href="#reference">字段说明</a>
            <a class="nav-link" href="https://github.com/nowscott/DailyTenderAPI">GitHub</a>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <section class="hero">
        <div class="container py-5 py-lg-6">
          <div class="row align-items-center g-4">
            <div class="col-lg-9 col-xl-8">
              <span class="badge bg-teal-subtle text-teal mb-3">
                <i class="bi bi-sunrise me-1"></i> iOS Shortcuts Message API
              </span>
              <h1 class="display-3 fw-bold mb-4">把每日问候消息交给一个稳定接口生成。</h1>
              <p class="lead text-secondary mb-4">
                快捷指令只负责采集日期、天气和位置；DailyTenderAPI 负责计算恋爱天数、阳历/农历生日倒计时、每日短句，并返回可直接发送的 message。
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
                    <p class="small text-secondary mb-0">城市解析、恋爱天数、阳历/农历生日倒计时和每日短句。</p>
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
          </div>
        </div>
      </section>

      <section class="py-5" id="shortcut">
        <div class="container">
          <div class="row mb-4 align-items-end g-3">
            <div class="col-lg-7">
              <h2 class="display-6 fw-bold">快捷指令只需要 4 步</h2>
              <p class="text-secondary mb-0">保持手机端流程简单，所有文本拼接逻辑都放在服务端，后续调整模板不需要重做快捷指令。</p>
            </div>
            <div class="col-lg-5 text-lg-end">
              <a class="btn btn-primary" href="${SHORTCUT_IMPORT_URL}" target="_blank" rel="noopener noreferrer">
                <i class="bi bi-box-arrow-up-right me-1"></i>导入快捷指令
              </a>
            </div>
          </div>
          <div class="soft-card p-3 p-md-4 mb-3">
            <div class="row align-items-center g-3">
              <div class="col-md-auto">
                <span class="step-icon"><i class="bi bi-phone"></i></span>
              </div>
              <div class="col">
                <h3 class="h5 fw-bold mb-2">可以先导入模板，再按自己的信息简单编辑。</h3>
                <p class="text-secondary mb-0">导入后主要检查接口地址、恋爱开始日、两个人生日/历法/emoji、问候称呼和发送对象；接口请求结构已经按 DailyTenderAPI 准备好。</p>
              </div>
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

      <section class="py-5 tester-section" id="tester">
        <div class="container">
          <div class="row mb-4">
            <div class="col-lg-7">
              <h2 class="display-6 fw-bold">在线测试</h2>
              <p class="text-secondary mb-0">用快捷指令准备好的 JSON 直接跑一次接口，确认返回的 message 是否符合发送需求。</p>
            </div>
          </div>
          <div class="hero-card overflow-hidden">
            <div class="tester-toolbar p-3 d-flex flex-column flex-sm-row gap-2 align-items-sm-center justify-content-between">
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
                  <textarea class="form-control request-editor" id="request-json" spellcheck="false"></textarea>
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
      </section>

      <section class="py-5" id="reference">
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
                      <tr><td><code>rainProbability</code></td><td>降雨概率，服务端会取整并补百分号。</td></tr>
                      <tr><td><code>loveStart</code></td><td>恋爱开始日期，默认按日期差计算第几天。</td></tr>
                      <tr><td><code>people[].calendar</code></td><td>农历生日传 lunar；不传就是公历。</td></tr>
                      <tr><td><code>people[].emoji</code></td><td>每个人生日倒计时行前面的 emoji。</td></tr>
                      <tr><td><code>to</code></td><td>第一行问候称呼，例如 小鹿。</td></tr>
                      <tr><td><code>closingText</code></td><td>每日提醒文案，例如 今天也要记得好好吃饭哦！</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <pre class="code-pane h-100" id="curl-example">curl -X POST "https://dtn.0211120.xyz/api/message" \\
  -H "content-type: application/json" \\
  -d '{"date":"2026-06-23","week":"星期二","location":"中国\\n浙江省\\n杭州市 西湖区\\n文三路","weather":"晴间多云","feelsLike":"29°C","rainProbability":"35","loveStart":"2022-05-20","to":"小鹿","closingText":"今天也要记得好好吃饭哦！","people":[{"name":"小鹿","birthday":"08-16","emoji":"🦌"},{"name":"星河","birthday":"08-16","calendar":"lunar","emoji":"🌙"}]}'</pre>
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
🌙距离星河生日还有95天
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
        <span>DailyTenderAPI v${SERVICE_VERSION}</span>
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
