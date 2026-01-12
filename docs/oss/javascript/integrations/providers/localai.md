---
title: LocalAI
---
>[LocalAI](https://localai.io/) 是一个免费、开源的 OpenAI 替代方案。
> `LocalAI` 作为一个即插即用的 REST API 替代品，兼容 OpenAI API 规范，用于本地推理。它允许你在本地或本地部署环境中，使用消费级硬件运行 LLM、生成图像、音频（以及更多功能），并支持多种模型系列和架构。

<Info>

`langchain-localai` 是用于 LocalAI 的第三方集成包。它提供了一种在 LangChain 中使用 LocalAI 服务的简单方式。
源代码可在 [GitHub](https://github.com/mkhludnev/langchain-localai) 上获取。

</Info>

## 安装与设置

::: code-group

```bash [pip]
pip install langchain-localai
```

```bash [uv]
uv add langchain-localai
```

:::

## 嵌入模型

查看[使用示例](/oss/javascript/integrations/text_embedding/localai)。

## 重排序器

查看[使用示例](/oss/javascript/integrations/document_transformers/localai_rerank)。
