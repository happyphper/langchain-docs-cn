---
title: Hugging Face
sidebarTitle: HuggingFaceEmbeddings
---
让我们加载 Hugging Face 嵌入类。

```python
pip install -qU  langchain langchain-huggingface sentence_transformers
```

```python
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
```

```python
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
```

```python
text = "This is a test document."
```

```python
query_result = embeddings.embed_query(text)
```

```python
query_result[:3]
```

```text
[-0.04895168915390968, -0.03986193612217903, -0.021562768146395683]
```

```python
doc_result = embeddings.embed_documents([text])
```

## Hugging Face 推理服务提供商

我们也可以通过 [推理服务提供商](https://huggingface.co/docs/inference-providers) 访问嵌入模型，这让我们可以在可扩展的无服务器基础设施上使用开源模型。

首先，我们需要从 [Hugging Face](https://huggingface.co/settings/tokens) 获取一个只读 API 密钥。

```python
from getpass import getpass

huggingfacehub_api_token = getpass()
```

现在我们可以使用 `HuggingFaceInferenceAPIEmbeddings` 类，通过 [推理服务提供商](https://huggingface.co/docs/inference-providers) 运行开源嵌入模型。

```python
from langchain_huggingface import HuggingFaceInferenceAPIEmbeddings

embeddings = HuggingFaceInferenceAPIEmbeddings(
    api_key=huggingfacehub_api_token,
    model_name="sentence-transformers/all-MiniLM-l6-v2",
)

query_result = embeddings.embed_query(text)
query_result[:3]
```

```text
[-0.038338541984558105, 0.1234646737575531, -0.028642963618040085]
```

## Hugging Face Hub

我们也可以通过 Hugging Face Hub 包在本地生成嵌入，这需要我们安装 `huggingface_hub`。

```python
!pip install huggingface_hub
```

```python
from langchain_huggingface.embeddings import HuggingFaceEndpointEmbeddings
```

```python
embeddings = HuggingFaceEndpointEmbeddings()
```

```python
text = "This is a test document."
```

```python
query_result = embeddings.embed_query(text)
```

```python
query_result[:3]
```
