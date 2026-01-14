---
title: 递归URL加载器
---

<Tip>

<strong>兼容性</strong>：仅适用于 Node.js。

</Tip>

本笔记本提供了快速入门 [RecursiveUrlLoader](/oss/javascript/integrations/document_loaders/) 的概述。有关 RecursiveUrlLoader 所有功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain_community_document_loaders_web_recursive_url.RecursiveUrlLoader.html)。

## 概述

### 集成详情

| 类 | 包 | 本地 | 可序列化 | Python 支持 |
| :--- | :--- | :---: | :---: |  :---: |
| [RecursiveUrlLoader](https://api.js.langchain.com/classes/langchain_community_document_loaders_web_recursive_url.RecursiveUrlLoader.html) | [@langchain/community](https://api.js.langchain.com/modules/langchain_community_document_loaders_web_recursive_url.html) | ✅ | beta | ❌ |

### 加载器特性

| 来源 | 网络加载器 | 仅限 Node 环境 |
| :---: | :---: | :---: |
| RecursiveUrlLoader | ✅ | ✅ |

从网站加载内容时，我们可能希望处理并加载页面上的所有 URL。

例如，让我们看一下 LangChain.js 的介绍文档。

它有许多我们可能想要加载、拆分并稍后批量检索的有趣子页面。

挑战在于遍历子页面的树状结构并组装一个列表！

我们使用 `RecursiveUrlLoader` 来实现这一点。

这也使我们能够灵活地排除某些子页面、自定义提取器等。

## 设置

要访问 `RecursiveUrlLoader` 文档加载器，您需要安装 `@langchain/community` 集成包和 [`jsdom`](https://www.npmjs.com/package/jsdom) 包。

### 凭证

如果您希望获取模型调用的自动追踪，也可以通过取消注释以下内容来设置您的 [LangSmith](/langsmith/home) API 密钥：

```bash
# export LANGSMITH_TRACING="true"
# export LANGSMITH_API_KEY="your-api-key"
```

### 安装

LangChain RecursiveUrlLoader 集成位于 `@langchain/community` 包中：

<CodeGroup>

```bash [npm]
npm install @langchain/community @langchain/core jsdom
</CodeGroup>

我们还建议添加像 [`html-to-text`](https://www.npmjs.com/package/html-to-text) 或
[`@mozilla/readability`](https://www.npmjs.com/package/@mozilla/readability) 这样的包，用于从页面提取原始文本。

<CodeGroup>

```bash npm
npm install html-to-text
```

```bash yarn
yarn add @langchain/community @langchain/core jsdom
```

```bash yarn
yarn add html-to-text
```

```bash yarn
yarn add @langchain/community @langchain/core jsdom
```

```bash pnpm
pnpm add html-to-text
```

```bash yarn
yarn add @langchain/community @langchain/core jsdom
```
</CodeGroup>

我们还建议添加像 [`html-to-text`](https://www.npmjs.com/package/html-to-text) 或
[`@mozilla/readability`](https://www.npmjs.com/package/@mozilla/readability) 这样的包，用于从页面提取原始文本。

<CodeGroup>

```bash npm
npm install html-to-text
```

```bash pnpm
pnpm add @langchain/community @langchain/core jsdom
```

```bash yarn
yarn add html-to-text
```

```bash pnpm
pnpm add @langchain/community @langchain/core jsdom
```

```bash pnpm
pnpm add html-to-text
```

```bash pnpm
pnpm add @langchain/community @langchain/core jsdom
```
</CodeGroup>

我们还建议添加像 [`html-to-text`](https://www.npmjs.com/package/html-to-text) 或
[`@mozilla/readability`](https://www.npmjs.com/package/@mozilla/readability) 这样的包，用于从页面提取原始文本。

## 实例化

现在我们可以实例化我们的模型对象并加载文档：

```typescript

const compiledConvert = compile({ wordwrap: 130 }); // returns (text: string) => string;

const loader = new RecursiveUrlLoader("https://langchain.com/",  {
  extractor: compiledConvert,
  maxDepth: 1,
  excludeDirs: ["/docs/api/"],
})
```

## 加载

```typescript
const docs = await loader.load()
docs[0]
```

{
  pageContent: '\n' +
    '/\n' +
    '产品\n' +
    '\n' +
    'LangChain [/langchain]LangSmith [/langsmith]LangGraph [/langgraph]\n' +
    '方法\n' +
    '\n' +
    '检索 [/retrieval]智能体（Agents） [/agents]评估 [/evaluation]\n' +
    '资源\n' +
    '\n' +
    '博客 [https://blog.langchain.dev/]案例研究 [/case-studies]用例灵感 [/use-cases]专家 [/experts]更新日志\n' +
    '[https://changelog.langchain.com/]\n' +
    '文档\n' +
    '\n' +
    'LangChain 文档 [https://python.langchain.com/v0.2/docs/introduction/]LangSmith 文档 [https://docs.smith.langchain.com/]\n' +
    '公司\n' +
    '\n' +
    '关于我们 [/about]招聘 [/careers]\n' +
    '定价 [/pricing]\n' +
    '申请演示 [/contact-sales]\n' +
    '注册 [https://smith.langchain.com/]\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    'LangChain 的产品套件支持开发者在 LLM 应用生命周期的每一步。\n' +
    '\n' +
    '\n' +
    '能够推理的应用程序。由 LANGCHAIN 驱动。\n' +
    '\n' +
    '申请演示 [/contact-sales]免费注册 [https://smith.langchain.com/]\n' +
    '\n' +
    '\n' +
    '\n' +
    '从初创公司到全球企业，\n' +
    '雄心勃勃的构建者选择\n' +
    'LANGCHAIN 产品。\n' +
    '\n' +
    '[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7c22746faa78338532_logo_Ally.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7c08e67bb7eefba4c2_logo_Rakuten.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7c576fdde32d03c1a0_logo_Elastic.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7c6d5592036dae24e5_logo_BCG.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/667f19528c3557c2c19c3086_the-home-depot-2%201.png][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7cbcf6473519b06d84_logo_IDEO.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7cb5f96dcc100ee3b7_logo_Zapier.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/6606183e52d49bc369acc76c_mdy_logo_rgb_moodysblue.png][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7c8ad7db6ed6ec611e_logo_Adyen.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7c737d50036a62768b_logo_Infor.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/667f59d98444a5f98aabe21c_acxiom-vector-logo-2022%201.png][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7c09a158ffeaab0bd2_logo_Replit.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7c9d2b23d292a0cab0_logo_Retool.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7c44e67a3d0a996bf3_logo_Databricks.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/667f5a1299d6ba453c78a849_image%20(19).png][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ca3b7c63af578816bafcc3_logo_Instacart.svg][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/665dc1dabc940168384d9596_podium%20logo.svg]\n' +
    '\n' +
    '构建\n' +
    '\n' +
    'LangChain 是一个通过链接可互操作组件来构建 LLM 应用的框架。LangGraph 是用于构建可控智能体（agentic）工作流的框架。\n' +
    '\n' +
    '\n' +
    '\n' +
    '运行\n' +
    '\n' +
    '使用 LangGraph Cloud（我们专为智能体构建的基础设施）大规模部署您的 LLM 应用程序。\n' +
    '\n' +
    '\n' +
    '\n' +
    '管理\n' +
    '\n' +
    "在 LangSmith 中调试、协作、测试和监控您的 LLM 应用——无论它是否使用 LangChain 框架构建。\n" +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '使用 LANGCHAIN 构建您的应用\n' +
    '\n' +
    '使用 LangChain 灵活的框架，利用您公司的数据和 API，构建具有上下文感知和推理能力的应用程序。\n' +
    '通过将供应商可选性作为您 LLM 基础设施设计的一部分，使您的应用面向未来。\n'

深入了解 LangChain

[/langchain]

使用 LANGGRAPH CLOUD 实现规模化运行

通过 LangGraph Cloud 部署您的 LangGraph 应用，以获得容错可扩展性——包括对异步后台作业、内置持久化和分布式任务队列的支持。

深入了解 LangGraph

[/langgraph]
[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/667c6d7284e58f4743a430e6_Langgraph%20UI-home-2.webp]

使用 LANGSMITH 管理 LLM 性能

借助 LangSmith 的调试、测试、部署和监控工作流，更快地交付产品。不要依赖“感觉”——为您的 LLM 开发工作流增添工程严谨性，无论您是否使用 LangChain 进行构建。

深入了解 LangSmith

[/langsmith]

聆听我们满意客户的心声

LangChain、LangGraph 和 LangSmith 帮助各种规模、各行各业的团队——从雄心勃勃的初创公司到成熟的企业。

[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c5308aee06d9826765c897_Retool_logo%201.png]

“LangSmith 帮助我们提高了 Retool 微调模型的准确性和性能。我们不仅通过使用 LangSmith 进行迭代交付了更好的产品，而且向用户发布新 AI 功能所需的时间也大大缩短，如果没有它，这将花费数倍的时间。”

[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c5308abdd2dbbdde5a94a1_Jamie%20Cuffe.png]
Jamie Cuffe
自助服务与新产品负责人
[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c5308a04d37cf7d3eb1341_Rakuten_Global_Brand_Logo.png]

“通过结合 LangSmith 的优势并站在庞大的开源社区的肩膀上，我们能够更快地确定在企业环境中使用 LLM 的正确方法。”

[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c5308a8b6137d44c621cb4_Yusuke%20Kaji.png]
Yusuke Kaji
AI 总经理
[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c5308aea1371b447cc4af9_elastic-ar21.png]

“在 Elastic AI Assistant 项目上与 LangChain 和 LangSmith 合作，对整体开发速度和交付体验的质量产生了显著的积极影响。没有 LangChain，我们无法实现交付给客户的产品体验；没有 LangSmith，我们无法以同样的速度完成它。”

[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c5308a4095d5a871de7479_James%20Spiteri.png]
James Spiteri
安全产品总监
[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c530539f4824b828357352_Logo_de_Fintual%201.png]

“我们一听说 LangSmith，就将整个开发栈迁移到了上面。我们本可以内部构建评估、测试和监控工具，但使用 LangSmith，我们只花了十分之一的时间就获得了一个好上千倍的工具。”

[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c53058acbff86f4c2dcee2_jose%20pena.png]
Jose Peña
高级经理

企业为取得成功而采用的参考架构。

LangChain 的产品套件可以独立使用，也可以组合使用以产生倍增效应——指导您完成 LLM 应用的构建、运行和管理。

[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/6695b116b0b60c78fd4ef462_15]

.07.24%20-Updated%20stack%20diagram%20-%20lightfor%20website-3.webp][https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/667d392696fc0bc3e17a6d04_New%20LC%20stack%20-%20light-2.webp]\n' +
    '1500万+\n' +
    '月下载量\n' +
    '10万+\n' +
    '应用支持\n' +
    '7.5万+\n' +
    'GitHub 星标\n' +
    '3000+\n' +
    '贡献者\n' +
    '\n' +
    '\n' +
    '生成式人工智能领域最大的开发者社区\n' +
    '\n' +
    '与 100 多万名推动行业发展的开发者共同学习。\n' +
    '\n' +
    '探索 LangChain\n' +
    '\n' +
    '[/langchain]\n' +
    '\n' +
    '\n' +
    '立即开始使用 LangSmith 平台\n' +
    '\n' +
    '获取演示 [/contact-sales]免费注册 [https://smith.langchain.com/]\n' +
    '[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65ccf12801bc39bf912a58f3_Home%20C.webp]\n' +
    '\n' +
    '使用 LangChain 构建的团队正在提高运营效率、增强发现与个性化能力，并提供能够创造收入的优质产品。\n' +
    '\n' +
    '探索用例\n' +
    '\n' +
    '[/use-cases]\n' +
    '\n' +
    '\n' +
    '从已成功实践的公司获取灵感。\n' +
    '\n' +
    '[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65bcd7ee85507bdf350399c3_Ally_Financial%201.svg]\n' +
    '金融服务\n' +
    '\n' +
    '[https://blog.langchain.dev/ally-financial-collaborates-with-langchain-to-deliver-critical-coding-module-to-mask-personal-identifying-information-in-a-compliant-and-safe-manner/]\n' +
    '[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65bcd8b3ae4dc901daa3037a_Adyen_Corporate_Logo%201.svg]\n' +
    '金融科技\n' +
    '\n' +
    '[https://blog.langchain.dev/llms-accelerate-adyens-support-team-through-smart-ticket-routing-and-support-agent-copilot/]\n' +
    '[https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c534b3fa387379c0f4ebff_elastic-ar21%20(1).png]\n' +
    '科技\n' +
    '\n' +
    '[https://blog.langchain.dev/langchain-partners-with-elastic-to-launch-the-elastic-ai-assistant/]\n' +
    '\n' +
    '\n' +
    'LANGSMITH 是为大语言模型构建的企业级开发运维平台。\n' +
    '\n' +
    '探索 LangSmith\n' +
    '\n' +
    '[/langsmith]\n' +
    '获得可见性，以便在成本、延迟和质量之间做出权衡。\n' +
    '提高开发人员生产力。\n' +
    '消除手动、易出错的测试。\n' +
    '减少幻觉并提高可靠性。\n' +
    '企业级部署选项，确保数据安全。\n' +
    '\n' +
    '\n' +
    '准备好开始更快地交付可靠的生成式人工智能应用了吗？\n' +
    '\n' +
    '开始使用 LangChain、LangGraph 和 LangSmith，从原型到生产，全面提升您的大语言模型应用开发。\n' +
    '\n' +
    '获取演示 [/contact-sales]免费注册 [https://smith.langchain.com/]\n' +
    '产品\n' +
    'LangChain [/langchain]LangSmith [/langsmith]LangGraph [/langgraph]智能体（Agents）[/agents]评估（Evaluation）[/evaluation]检索（Retrieval）[/retrieval]\n' +
    '资源\n' +
    'Python 文档 [https://python.langchain.com/]JS/TS 文档 [https://js.langchain.com/docs/get_started/introduction/]GitHub\n' +
    '[https://github.com/langchain-ai]集成 [https://python.langchain.com/v0.2/docs/integrations/platforms/]模板\n' +
    '[https://templates.langchain.com/]更新日志 [https://changelog.langchain.com/]LangSmith 信任门户\n' +
    '[https://trust.langchain.com/]\n' +
    '公司\n' +
    '关于我们 [/about]博客 [https://blog.langchain.dev/]Twitter [https://twitter.com/LangChain]LinkedIn\n' +
    '[https://www.linkedin.com/company/langchain/]YouTube [https://www.youtube.com/@LangChain]社区 [/join-community]营销\n' +
    '素材 [https://drive.google.com/drive/folders/17xybjzmVBdsQA-VxouuGLxF6bDsHDe80?usp=sharing]\n' +
    '订阅我们的新闻通讯以获取最新信息\n' +
    '感谢！您的提交已收到！\n' +
    '糟糕！出错了

在提交表单时。

所有系统运行正常

隐私政策

```typescript
console.log(docs[0].metadata)
```

```javascript
{
  source: 'https://langchain.com/',
  title: 'LangChain',
  description: 'LangChain's suite of products supports developers along each step of their development journey.',
  language: 'en'
}
```

## 选项

```typescript
interface Options {
  excludeDirs?: string[]; // 要排除的网页目录。
  extractor?: (text: string) => string; // 一个用于从网页中提取文档文本的函数，默认情况下原样返回页面。建议使用 html-to-text 等工具来提取文本。默认情况下，它只是原样返回页面。
  maxDepth?: number; // 要爬取的最大深度。默认设置为 2。如果需要爬取整个网站，将其设置为足够大的数字即可。
  timeout?: number; // 每个请求的超时时间，单位为秒。默认设置为 10000（10 秒）。
  preventOutside?: boolean; // 是否阻止爬取根 URL 之外的链接。默认设置为 true。
  callerOptions?: AsyncCallerConstructorParams; // 调用 AsyncCaller 的选项，例如设置最大并发数（默认为 64）
}
```

然而，由于很难执行完美的过滤，您可能仍然会在结果中看到一些不相关的内容。如果需要，您可以自己对返回的文档执行过滤。大多数情况下，返回的结果已经足够好。

---

## API 参考

有关 RecursiveUrlLoader 所有功能和配置的详细文档，请前往 [API 参考](https://api.js.langchain.com/classes/langchain_community_document_loaders_web_recursive_url.RecursiveUrlLoader.html)。
