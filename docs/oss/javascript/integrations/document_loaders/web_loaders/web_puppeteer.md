---
title: PuppeteerWebBaseLoader
---

<Tip>

<strong>兼容性</strong>：仅在 Node.js 环境中可用。

</Tip>

本笔记本提供了快速入门 [PuppeteerWebBaseLoader](/oss/integrations/document_loaders/) 的概述。有关 PuppeteerWebBaseLoader 所有功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain_community_document_loaders_web_puppeteer.PuppeteerWebBaseLoader.html)。

Puppeteer 是一个 Node.js 库，提供了用于控制无头 Chrome 或 Chromium 的高级 API。您可以使用 Puppeteer 来自动化网页交互，包括从需要 JavaScript 渲染的动态网页中提取数据。

如果您需要一个更轻量级的解决方案，并且您想要加载的网页不需要 JavaScript 渲染，可以使用 [CheerioWebBaseLoader](/oss/integrations/document_loaders/web_loaders/web_cheerio) 替代。

## 概述

### 集成详情

| 类 | 包 | 本地 | 可序列化 | Python 支持 |
| :--- | :--- | :---: | :---: |  :---: |
| [PuppeteerWebBaseLoader](https://api.js.langchain.com/classes/langchain_community_document_loaders_web_puppeteer.PuppeteerWebBaseLoader.html) | [@langchain/community](https://api.js.langchain.com/modules/langchain_community_document_loaders_web_puppeteer.html) | ✅ | beta | ❌ |

### 加载器特性

| 来源 | Web 加载器 | 仅 Node 环境 |
| :---: | :---: | :---: |
| PuppeteerWebBaseLoader | ✅ | ✅ |

## 设置

要使用 `PuppeteerWebBaseLoader` 文档加载器，您需要安装 `@langchain/community` 集成包，以及 `puppeteer` 对等依赖项。

### 凭证

如果您希望获得模型调用的自动化追踪，也可以通过取消注释以下内容来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain PuppeteerWebBaseLoader 集成位于 `@langchain/community` 包中：

::: code-group

```bash [npm]
npm install @langchain/community @langchain/core puppeteer
```

```bash [yarn]
yarn add @langchain/community @langchain/core puppeteer
```

```bash [pnpm]
pnpm add @langchain/community @langchain/core puppeteer
```

:::

## 实例化

现在我们可以实例化我们的模型对象并加载文档：

```typescript
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer"

const loader = new PuppeteerWebBaseLoader("https://langchain.com", {
  // required params = ...
  // optional params = ...
})
```

## 加载

```typescript
const docs = await loader.load()
docs[0]
```

```javascript
Document {
  pageContent: '
<div class="page-wrapper">
<div class="global-styles w-embed"><style>\n' +
'\n' +
'* {\n' +
'  -webkit-font-smoothing: antialiased;\n' +
'}\n' +
'\n' +
'.page-wrapper {\n' +
'overflow: clip;\n' +
'  }\n' +
'\n' +
'\n' +
'\n' +
'/* Set fluid size change for smaller breakpoints */\n' +
'  html { font-size: 1rem; }\n' +
'  @media screen and (max-width:1920px) and (min-width:1281px) { html { font-size: calc(0.2499999999999999rem + 0.6250000000000001vw); } }\n' +
'  @media screen and (max-width:1280px) and (min-width:992px) { html { font-size: calc(0.41223612197028925rem + 0.4222048475371384vw); } }\n' +
'/* video sizing */\n' +
'\n' +
'video {\n' +
'    object-fit: fill;\n' +
'\t\twidth: 100%;\n' +
'}\n' +
'\n' +
'\n' +
'\n' +
'#retrieval-video {\n' +
'    object-fit: cover;\n' +
'    width: 100%;\n' +
'}\n' +
'\n' +
'\n' +
'\n' +
'/* Set color style to inherit */\n' +
'.inherit-color * {\n' +
'    color: inherit;\n' +
'}\n' +
'\n' +
'/* Focus state style for keyboard navigation for the focusable elements */\n' +
'*[tabindex]:focus-visible,\n' +
'  input[type="file"]:focus-visible {\n' +
'   outline: 0.125rem solid #4d65ff;\n' +
'   outline-offset: 0.125rem;\n' +
'}\n' +
'\n' +
'/* Get rid of top margin on first element in any rich text element */\n' +
'.w-richtext > :not(div):first-child, .w-richtext > div:first-child > :first-child {\n' +
'  margin-top: 0 !important;\n' +
'}\n' +
'\n' +
'/* Get rid of bottom margin on last element in any rich text element */\n' +
'.w-richtext>:last-child, .w-richtext ol li:last-child, .w-richtext ul li:last-child {\n' +
'\tmargin-bottom: 0 !important;\n' +
'}\n' +
'\n' +
'/* Prevent all click and hover interaction with an element */\n' +
'.pointer-events-off {\n' +
'\tpointer-events: none;\n' +
'}\n' +
'\n' +
'/* Enables all click and hover interaction with an element */\n' +
'.pointer-events-on {\n' +
'  pointer-events: auto;\n' +
'}\n' +
'\n' +
'/* Create a class of .div-square which maintains a 1:1 dimension of a div */\n' +
'.div-square::after {\n' +
'\tcontent: "";\n' +
'\tdisplay: block;\n' +
'\tpadding-bottom: 100%;\n' +
'}\n' +
'\n' +
'/* Make sure containers never lose their center alignment */\n' +
'.container-medium,.container-small, .container-large {\n' +
'\tmargin-right: auto !important;\n' +
'  margin-left: auto !important;\n' +
'}\n' +
'\n' +
'/* \n' +
'Make the following elements inherit typography styles from the parent and not have hardcoded values. \n' +
'Important: You will not be able to style for example "All Links" in Designer with this CSS applied.\n' +
'Uncomment this CSS to use it in the project. Leave this message for future hand-off.\n' +
'*/\n' +
'/*\n' +
'a,\n' +
'.w-input,\n' +
'.w-select,\n' +
'.w-tab-link,\n' +
'.w-nav-link,\n' +
'.w-dropdown-btn,\n' +
'.w-dropdown-toggle,\n' +
'.w-dropdown-link {\n' +
'  color: inherit;\n' +
'  text-decoration: inherit;\n' +
'  font-size: inherit;\n' +
'}\n' +
'*/\n' +
'\n' +
'/* Apply "..." after 3 lines of text */\n' +
'.text-style-3lines {\n' +
'\tdisplay: -webkit-box;\n' +
'\toverflow: hidden;\n' +
'\t-webkit-line-clamp: 3;\n' +
'\t-webkit-box-orient: vertical;\n' +
'}\n' +
'\n' +
'/* Apply "..." after 2 lines of text */\n' +
'.text-style-2lines {\n' +
'\tdisplay: -webkit-box;\n' +
'\toverflow: hidden;\n' +
'\t-webkit-line-clamp: 2;\n' +
'\t-webkit-box-orient: vertical;\n' +
'}\n' +
'\n' +
'/* Adds inline flex display */\n' +
'.display-inlineflex {\n' +
'  display: inline-flex;\n' +
'}\n' +
'\n' +
'/* These classes are never overwritten */\n' +
'.hide {\n' +
'  display: none !important;\n' +
'}\n' +
'\n' +
'@media screen and (max-width: 991px) {\n' +
'    .hide, .hide-tablet {\n' +
'        display: none !important;\n' +
'    }\n' +
'}\n' +
'  @media screen and (max-width: 767px) {\n' +
'    .hide-mobile-landscape{\n' +
'      display: none !important;\n' +
'    }\n' +
'}\n' +
'  @media screen and (max-width: 479px) {\n' +
'    .hide-mobile{\n' +
'      display: none !important;\n' +
'    }\n' +
'}\n' +
' \n' +
'.margin-0 {\n' +
'  margin: 0rem !important;\n' +
'}\n' +
'  \n' +
'.padding-0 {\n' +
'  padding: 0rem !important;\n' +
'}\n' +
'\n' +
'.spacing-clean {\n' +
'padding: 0rem !important;\n' +
'margin: 0rem !important;\n' +
'}\n' +
'\n' +
'.margin-top {\n' +
'  margin-right: 0rem !important;\n' +
'  margin-bottom: 0rem !important;\n' +
'  margin-left: 0rem !important;\n' +
'}\n' +
'\n' +
'.padding-top {\n' +
'  padding-right: 0rem !important;\n' +
'  padding-bottom: 0rem !important;\n' +
'  padding-left: 0rem !important;\n' +
'}\n' +
'  \n' +
'.margin-right {\n' +
'  margin-top: 0rem !important;\n' +
'  margin-bottom: 0rem !important;\n' +
'  margin-left: 0rem !important;\n' +
'}\n' +
'\n' +
'.padding-right {\n' +
'  padding-top: 0rem !important;\n' +
'  padding-bottom: 0rem !important;\n' +
'  padding-left: 0rem !important;\n' +
'}\n' +
'\n' +
'.margin-bottom {\n' +
'  margin-top: 0rem !important;\n' +
'  margin-right: 0rem !important;\n' +
'  margin-left: 0rem !important;\n' +
'}\n' +
'\n' +
'.padding-bottom {\n' +
'  padding-top: 0rem !important;\n' +
'  padding-right: 0rem !important;\n' +
'  padding-left: 0rem !important;\n' +
'}\n' +
'\n' +
'.margin-left {\n' +
'  margin-top: 0rem !important;\n' +
'  margin-right: 0rem !important;\n' +
'  margin-bottom: 0rem !important;\n' +
'}\n' +
'  \n' +
'.padding-left {\n' +
'  padding-top: 0rem !important;\n' +
'  padding-right: 0rem !important;\n' +
'  padding-bottom: 0rem !important;\n' +
'}\n' +
'  \n' +
'.margin-horizontal {\n' +
'  margin-top: 0rem !important;\n' +
'  margin-bottom: 0rem !important;\n' +
'}\n' +
'\n' +
'.padding-horizontal {\n' +
'  padding-top: 0rem !important;\n' +
'  padding-bottom: 0rem !important;\n' +
'}\n' +
'\n' +
'.margin-vertical {\n' +
'  margin-right: 0rem !important;\n' +
'  margin-left: 0rem !important;\n' +
'}\n' +
'  \n' +
'.padding-vertical {\n' +
'  padding-right: 0rem !important;\n' +
'  padding-left: 0rem !important;\n' +
'}\n' +
'\n' +
'/* Apply "..." at 100% width */\n' +
'.truncate-width { \n' +
'\t\twidth: 100%; \n' +
'    white-space: nowrap; \n' +
'    overflow: hidden; \n' +
'    text-overflow: ellipsis; \n' +
'}\n' +
'/* Removes native scrollbar */\n' +
'.no-scrollbar {\n' +
'    -ms-overflow-style: none;\n' +
'    overflow: -moz-scrollbars-none; \n' +
'}\n' +
'\n' +
'.no-scrollbar::-webkit-scrollbar {\n' +
'    display: none;\n' +
'}\n' +
'\n' +
'input:checked + span {\n' +
'color: white    /* styles for the div immediately following the checked input */\n' +
'}\n' +
'\n' +
'/* styles for word-wrapping\n' +
'h1, h2, h3 {\n' +
'word-wrap: break-word;\n' +
'hyphens: auto;\n' +
'}*/\n' +
'\n' +
'[nav-theme="light"] .navbar_logo-svg {\n' +
'\t--nav--logo: var(--light--logo);\n' +
'}\n' +
'\n' +
'[nav-theme="light"] .button.is-nav {\n' +
'\t--nav--button-bg: var(--light--button-bg);\n' +
'\t--nav--button-text: var(--light--button-text);\n' +
'}\n' +
'\n' +
'[nav-theme="light"] .button.is-nav:hover {\n' +
'\t--nav--button-bg: var(--dark--button-bg);\n' +
'\t--nav--button-text:var(--dark--button-text);\n' +
'}\n' +
'\n' +
'[nav-theme="dark"] .navbar_logo-svg {\n' +
'\t--nav--logo: var(--dark--logo);\n' +
'}\n' +
'\n' +
'[nav-theme="dark"] .button.is-nav {\n' +
'\t--nav--button-bg: var(--dark--button-bg);\n' +
'\t--nav--button-text: var(--dark--button-text);\n' +
'}\n' +
'\n' +
'[nav-theme="dark"] .button.is-nav:hover {\n' +
'\t--nav--button-bg: var(--light--button-bg);\n' +
'\t--nav--button-text: var(--light--button-text);\n' +
'}\n' +
'\n' +
'[nav-theme="red"] .navbar_logo-svg {\n' +
'\t--nav--logo: var(--red--logo);\n' +
'}\n' +
'\n' +
'\n' +
'[nav-theme="red"] .button.is-nav {\n' +
'\t--nav--button-bg: var(--red--button-bg);\n' +
'\t--nav--button-text: var(--red--button-text);\n' +
'}\n' +
'\n' +
'.navbar_logo-svg.is-light, .navbar_logo-svg.is-red.is-light{\n' +
'color: #F8F7FF!important;\n' +
'}\n' +
'\n' +
'.news_button[disabled] {\n' +
'background: none;\n' +
'}\n' +
'\n' +
'.product_bg-video video {\n' +
'object-fit: fill;\n' +
'}\n' +
'\n' +
'</style>
</div>
<div data-animation="default" class="navbar_component w-nav" data-easing2="ease" fs-scrolldisable-element="smart-nav" data-easing="ease" data-collapse="medium" data-w-id="78839fc1-6b85-b108-b164-82fcae730868" role="banner" data-duration="400" style="will-change: width, height; height: 
