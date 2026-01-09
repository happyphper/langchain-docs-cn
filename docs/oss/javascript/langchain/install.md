---
title: 安装 LangChain
sidebarTitle: Install
---
要安装 LangChain 包：

::: code-group

```bash [npm]
npm install langchain @langchain/core
# Requires Node.js 20+
```

```bash [pnpm]
pnpm add langchain @langchain/core
# Requires Node.js 20+
```

```bash [yarn]
yarn add langchain @langchain/core
# Requires Node.js 20+
```

```bash [bun]
bun add langchain @langchain/core
# Requires Node.js 20+
```

:::

LangChain 提供了与数百个 LLM 和数千个其他工具的集成。这些功能位于独立的提供商包中。

::: code-group

```bash [npm]
# 安装 OpenAI 集成
npm install @langchain/openai
# 安装 Anthropic 集成
npm install @langchain/anthropic
```

```bash [pnpm]
# 安装 OpenAI 集成
pnpm install @langchain/openai
# 安装 Anthropic 集成
pnpm install @langchain/anthropic
```

```bash [yarn]
# 安装 OpenAI 集成
yarn add @langchain/openai
# 安装 Anthropic 集成
yarn add @langchain/anthropic
```

```bash [bun]
# 安装 OpenAI 集成
bun add @langchain/openai
# 安装 Anthropic 集成
bun add @langchain/anthropic
```

:::

<Tip>

请查看 [集成页面](/oss/integrations/providers/overview) 以获取完整的可用集成列表。

</Tip>

现在你已经安装了 LangChain，可以按照 [快速入门指南](/oss/langchain/quickstart) 开始使用。
