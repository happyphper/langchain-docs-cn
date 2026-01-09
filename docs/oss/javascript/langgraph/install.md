---
title: 安装 LangGraph
sidebarTitle: Install
---
要安装基础的 LangGraph 包：

::: code-group

```bash [npm]
npm install @langchain/langgraph @langchain/core
```

```bash [pnpm]
pnpm add @langchain/langgraph @langchain/core
```

```bash [yarn]
yarn add @langchain/langgraph @langchain/core
```

```bash [bun]
bun add @langchain/langgraph @langchain/core
```

:::

使用 LangGraph 时，通常需要访问 LLM 并定义工具。你可以按自己的方式实现。

一种方法（我们将在文档中使用）是使用 [LangChain](/oss/langchain/overview)。

安装 LangChain：

::: code-group

```bash [npm]
npm install langchain
```

```bash [pnpm]
pnpm add langchain
```

```bash [yarn]
yarn add langchain
```

```bash [bun]
bun add langchain
```

:::

要使用特定的 LLM 提供商包，你需要单独安装它们。

请参阅 [集成](/oss/integrations/providers/overview) 页面获取特定提供商的安装说明。
