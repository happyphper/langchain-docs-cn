---
title: EdenAI
---
Eden AI 正在通过整合顶尖的 AI 提供商来革新 AI 领域，赋能用户解锁无限可能并挖掘人工智能的真正潜力。凭借一个全面且无忧的一体化平台，它允许用户闪电般地将 AI 功能部署到生产环境，通过单一 API 即可轻松访问全方位的 AI 能力。（网站：[edenai.co/](https://edenai.co/)）

本示例将介绍如何使用 LangChain 与 Eden AI 的嵌入模型进行交互。

-----------------------------------------------------------------------------------

访问 EDENAI 的 API 需要一个 API 密钥，

您可以通过注册账户 [app.edenai.run/user/register](https://app.edenai.run/user/register) 并前往此处 [app.edenai.run/admin/account/settings](https://app.edenai.run/admin/account/settings) 获取。

获取密钥后，我们需要通过运行以下命令将其设置为环境变量：

```shell
export EDENAI_API_KEY="..."
```

如果您不希望设置环境变量，也可以在初始化 EdenAI 嵌入类时，通过 `edenai_api_key` 命名参数直接传入密钥：

```python
from langchain_community.embeddings.edenai import EdenAiEmbeddings
```

```python
embeddings = EdenAiEmbeddings(edenai_api_key="...", provider="...")
```

## 调用模型

EdenAI API 汇集了众多提供商。

要访问特定模型，您只需在调用时指定 "provider" 参数。

```python
embeddings = EdenAiEmbeddings(provider="openai")
```

```python
docs = ["It's raining right now", "cats are cute"]
document_result = embeddings.embed_documents(docs)
```

```python
query = "my umbrella is broken"
query_result = embeddings.embed_query(query)
```

```python
import numpy as np

query_numpy = np.array(query_result)
for doc_res, doc in zip(document_result, docs):
    document_numpy = np.array(doc_res)
    similarity = np.dot(query_numpy, document_numpy) / (
        np.linalg.norm(query_numpy) * np.linalg.norm(document_numpy)
    )
    print(f'Cosine similarity between "{doc}" and query: {similarity}')
```

```text
Cosine similarity between "It's raining right now" and query: 0.849261496107252
Cosine similarity between "cats are cute" and query: 0.7525900655705218
```
