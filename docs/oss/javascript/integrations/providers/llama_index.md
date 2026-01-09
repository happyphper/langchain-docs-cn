---
title: LlamaIndex
---
>[LlamaIndex](https://www.llamaindex.ai/) 是用于构建 LLM 应用程序的领先数据框架。

## 安装与设置

你需要安装 `llama-index` Python 包。

::: code-group

```bash [pip]
pip install llama-index
```

```bash [uv]
uv add llama-index
```

:::

请参阅 [安装说明](https://docs.llamaindex.ai/en/stable/getting_started/installation/)。

## 检索器

### LlamaIndexRetriever

> 它用于在 LlamaIndex 数据结构上进行带来源的问答。

```python
from langchain_community.retrievers.llama_index import LlamaIndexRetriever
```

### LlamaIndexGraphRetriever

> 它用于在 LlamaIndex 图数据结构上进行带来源的问答。

```python
from langchain_community.retrievers.llama_index import LlamaIndexGraphRetriever
```
