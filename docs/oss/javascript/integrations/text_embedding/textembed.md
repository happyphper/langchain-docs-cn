---
title: TextEmbed - 嵌入推理服务器
---
TextEmbed 是一个专为提供向量嵌入服务而设计的高吞吐量、低延迟 REST API。它支持广泛的句子转换器模型和框架，适用于自然语言处理中的各种应用场景。

## 功能特性

- **高吞吐量与低延迟：** 设计用于高效处理大量请求。
- **灵活的模型支持：** 可与多种句子转换器模型配合使用。
- **可扩展性：** 易于集成到更大的系统中，并能随需求扩展。
- **批处理：** 支持批处理，以实现更好、更快的推理。
- **OpenAI 兼容的 REST API 端点：** 提供与 OpenAI 兼容的 REST API 端点。
- **单行命令部署：** 通过单条命令部署多个模型，实现高效部署。
- **支持嵌入格式：** 支持二进制、float16 和 float32 嵌入格式，以实现更快的检索。

## 快速开始

### 先决条件

确保已安装 Python 3.10 或更高版本。您还需要安装所需的依赖项。

## 通过 PyPI 安装

1. **安装所需的依赖项：**

```bash
pip install -U textembed
```

2. **使用您所需的模型启动 TextEmbed 服务器：**

```bash
python -m textembed.server --models sentence-transformers/all-MiniLM-L12-v2 --workers 4 --api-key TextEmbed
```

更多信息，请阅读[文档](https://github.com/kevaldekivadiya2415/textembed/blob/main/docs/setup.md)。

### 导入

```python
from langchain_community.embeddings import TextEmbedEmbeddings
```

```python
embeddings = TextEmbedEmbeddings(
    model="sentence-transformers/all-MiniLM-L12-v2",
    api_url="http://0.0.0.0:8000/v1",
    api_key="TextEmbed",
)
```

### 嵌入您的文档

```python
# 定义文档列表
documents = [
    "Data science involves extracting insights from data.",
    "Artificial intelligence is transforming various industries.",
    "Cloud computing provides scalable computing resources over the internet.",
    "Big data analytics helps in understanding large datasets.",
    "India has a diverse cultural heritage.",
]

# 定义一个查询
query = "What is the cultural heritage of India?"
```

```python
# 嵌入所有文档
document_embeddings = embeddings.embed_documents(documents)

# 嵌入查询
query_embedding = embeddings.embed_query(query)
```

```python
# 计算相似度
import numpy as np

scores = np.array(document_embeddings) @ np.array(query_embedding).T
dict(zip(documents, scores))
```

```text
{'Data science involves extracting insights from data.': 0.05121298956322118,
 'Artificial intelligence is transforming various industries.': -0.0060612142358469345,
 'Cloud computing provides scalable computing resources over the internet.': -0.04877402795301714,
 'Big data analytics helps in understanding large datasets.': 0.016582168576929422,
 'India has a diverse cultural heritage.': 0.7408992963028144}
```

```python

```
