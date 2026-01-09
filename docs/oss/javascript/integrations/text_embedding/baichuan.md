---
title: 百川文本嵌入
---
截至今日（2024年1月25日），BaichuanTextEmbeddings 在 C-MTEB（中文多任务嵌入基准）排行榜中位列第一。

排行榜（位于 Overall -> Chinese 部分）：[huggingface.co/spaces/mteb/leaderboard](https://huggingface.co/spaces/mteb/leaderboard)

官方网站：[platform.baichuan-ai.com/docs/text-Embedding](https://platform.baichuan-ai.com/docs/text-Embedding)

使用此嵌入模型需要 API 密钥。您可以通过在 [platform.baichuan-ai.com/docs/text-Embedding](https://platform.baichuan-ai.com/docs/text-Embedding) 注册来获取。

BaichuanTextEmbeddings 支持 512 个 token 的窗口，并生成 1024 维的向量。

请注意，BaichuanTextEmbeddings 目前仅支持中文文本嵌入。多语言支持即将推出。

```python
from langchain_community.embeddings import BaichuanTextEmbeddings

embeddings = BaichuanTextEmbeddings(baichuan_api_key="sk-*")
```

或者，您也可以通过以下方式设置 API 密钥：

```python
import os

os.environ["BAICHUAN_API_KEY"] = "YOUR_API_KEY"
```

```python
text_1 = "今天天气不错"
text_2 = "今天阳光很好"

query_result = embeddings.embed_query(text_1)
query_result
```

```python
doc_result = embeddings.embed_documents([text_1, text_2])
doc_result
```
