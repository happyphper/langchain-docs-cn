---
title: Voyage AI
---
>[Voyage AI](https://www.voyageai.com/) 提供前沿的嵌入/向量化模型。

让我们加载 Voyage AI 嵌入类。（使用 `pip install langchain-voyageai` 安装 LangChain 合作伙伴包）

```python
from langchain_voyageai import VoyageAIEmbeddings
```

Voyage AI 使用 API 密钥来监控使用情况和管理权限。要获取您的密钥，请在[我们的主页](https://www.voyageai.com)上创建一个账户。然后，使用您的 API 密钥创建一个 VoyageEmbeddings 模型。您可以使用以下任何模型：（[来源](https://docs.voyageai.com/docs/embeddings)）：

- `voyage-context-3`
- `voyage-3.5`
- `voyage-3.5-lite`
- `voyage-3-large`
- `voyage-3`
- `voyage-3-lite`
- `voyage-large-2`
- `voyage-code-2`
- `voyage-2`
- `voyage-law-2`
- `voyage-large-2-instruct`
- `voyage-finance-2`
- `voyage-multilingual-2`

```python
embeddings = VoyageAIEmbeddings(
    voyage_api_key="[ 您的 Voyage API 密钥 ]", model="voyage-law-2"
)
```

准备文档并使用 `embed_documents` 获取它们的嵌入向量。

```python
documents = [
    "缓存嵌入向量支持存储或临时缓存嵌入向量，从而避免了每次都需要重新计算。",
    "LLMChain 是一个组合了基础 LLM 功能的链。它由一个 PromptTemplate 和一个语言模型（可以是 LLM 或聊天模型）组成。它使用提供的输入键值（以及可用的内存键值）格式化提示模板，将格式化后的字符串传递给 LLM，并返回 LLM 的输出。",
    "Runnable 代表一个通用的工作单元，可以被调用、批处理、流式处理和/或转换。",
]
```

```python
documents_embds = embeddings.embed_documents(documents)
```

```python
documents_embds[0][:5]
```

```text
[0.0562174916267395,
 0.018221192061901093,
 0.0025736060924828053,
 -0.009720131754875183,
 0.04108370840549469]
```

类似地，使用 `embed_query` 来嵌入查询。

```python
query = "什么是 LLMChain？"
```

```python
query_embd = embeddings.embed_query(query)
```

```python
query_embd[:5]
```

```text
[-0.0052348352037370205,
 -0.040072452276945114,
 0.0033957737032324076,
 0.01763271726667881,
 -0.019235141575336456]
```

## 一个极简的检索系统

嵌入向量的主要特点是，两个嵌入向量之间的余弦相似度能够捕捉到对应原始文本片段的语义相关性。这使我们能够使用嵌入向量进行语义检索/搜索。

我们可以基于余弦相似度在文档嵌入向量中找到几个最接近的嵌入向量，并使用 LangChain 中的 `KNNRetriever` 类来检索对应的文档。

```python
from langchain_community.retrievers import KNNRetriever

retriever = KNNRetriever.from_texts(documents, embeddings)

# 检索最相关的文档
result = retriever.invoke(query)
top1_retrieved_doc = result[0].page_content  # 返回 top1 检索结果

print(top1_retrieved_doc)
```

```text
LLMChain 是一个组合了基础 LLM 功能的链。它由一个 PromptTemplate 和一个语言模型（可以是 LLM 或聊天模型）组成。它使用提供的输入键值（以及可用的内存键值）格式化提示模板，将格式化后的字符串传递给 LLM，并返回 LLM 的输出。
```
