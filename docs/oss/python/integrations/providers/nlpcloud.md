---
title: NLPCloud
---
>[NLP Cloud](https://docs.nlpcloud.com/#introduction) 是一个人工智能平台，允许您使用最先进的 AI 引擎，甚至可以使用您自己的数据训练自己的引擎。

## 安装与设置

- 安装 `nlpcloud` 包。

::: code-group

```bash [pip]
pip install nlpcloud
```

```bash [uv]
uv add nlpcloud
```

:::

- 获取一个 NLPCloud API 密钥，并将其设置为环境变量 (`NLPCLOUD_API_KEY`)。

## 大语言模型 (LLM)

查看[使用示例](/oss/python/integrations/llms/nlpcloud)。

```python
from langchain_community.llms import NLPCloud
```

## 文本嵌入模型

查看[使用示例](/oss/python/integrations/text_embedding/nlp_cloud)

```python
from langchain_community.embeddings import NLPCloudEmbeddings
```
