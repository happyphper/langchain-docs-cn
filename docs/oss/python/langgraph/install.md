---
title: 安装 LangGraph
sidebarTitle: Install
---
要安装基础的 LangGraph 包：

::: code-group

```bash [pip]
pip install -U langgraph
```

```bash [uv]
uv add langgraph
```

:::

使用 LangGraph 时，通常需要访问 LLM 并定义工具。你可以按自己的方式实现。

一种方法（我们将在文档中使用）是使用 [LangChain](/oss/python/langchain/overview)。

安装 LangChain：

::: code-group

```bash [pip]
pip install -U langchain
# Requires Python 3.10+
```

```bash [uv]
uv add langchain
# Requires Python 3.10+
```

:::

要使用特定的 LLM 提供商包，你需要单独安装它们。

请参阅 [集成](/oss/python/integrations/providers/overview) 页面获取特定提供商的安装说明。
