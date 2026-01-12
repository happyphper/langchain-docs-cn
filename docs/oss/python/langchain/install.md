---
title: 安装 LangChain
sidebarTitle: Install
---
要安装 LangChain 包：

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

LangChain 提供了与数百个 LLM 和数千个其他工具的集成。这些功能位于独立的提供商包中。

::: code-group

```bash [pip]
# 安装 OpenAI 集成
pip install -U langchain-openai

# 安装 Anthropic 集成
pip install -U langchain-anthropic
```
```bash [uv]
# 安装 OpenAI 集成
uv add langchain-openai

# 安装 Anthropic 集成
uv add langchain-anthropic
```

:::

<Tip>

请查看 [集成页面](/oss/python/integrations/providers/overview) 以获取完整的可用集成列表。

</Tip>

现在你已经安装了 LangChain，可以按照 [快速入门指南](/oss/python/langchain/quickstart) 开始使用。
