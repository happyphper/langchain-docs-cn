---
title: Upstage
---
>[Upstage](https://upstage.ai) 是一家领先的人工智能（AI）公司，专注于提供超越人类水平的 LLM 组件。

>**Solar Pro** 是一款企业级 LLM，针对单 GPU 部署进行了优化，在遵循指令和处理 HTML 和 Markdown 等结构化格式方面表现出色。它支持英语、韩语和日语，具备顶级的跨语言性能，并在金融、医疗和法律领域提供专业知识。

>除了 Solar，Upstage 还提供用于现实世界 RAG（检索增强生成）的功能，例如 **Document Parse** 和 **Groundedness Check**。

### Upstage LangChain 集成

| API | 描述 | 导入 | 示例用法 |
| --- | --- | --- | --- |
| Chat | 使用 Solar Chat 构建助手 | `from langchain_upstage import ChatUpstage` | [前往](/oss/integrations/chat/upstage) |
| Text Embedding | 将字符串嵌入为向量 | `from langchain_upstage import UpstageEmbeddings` | [前往](/oss/integrations/text_embedding/upstage) |
| Groundedness Check | 验证助手响应的真实性 | `from langchain_upstage import UpstageGroundednessCheck` | [前往](/oss/integrations/tools/upstage_groundedness_check) |
| Document Parse | 序列化包含表格和图形的文档 | `from langchain_upstage import UpstageDocumentParseLoader` | [前往](/oss/integrations/document_loaders/upstage) |

有关模型和功能的更多详细信息，请参阅[文档](https://console.upstage.ai/docs/getting-started/overview)。

## 安装与设置

安装 `langchain-upstage` 包：

```bash
pip install -qU langchain-core langchain-upstage
```

获取 [API 密钥](https://console.upstage.ai) 并设置环境变量 `UPSTAGE_API_KEY`。

```python
import os

os.environ["UPSTAGE_API_KEY"] = "YOUR_API_KEY"
```

## 聊天模型

### Solar LLM

查看[使用示例](/oss/integrations/chat/upstage)。

```python
from langchain_upstage import ChatUpstage

chat = ChatUpstage()
response = chat.invoke("Hello, how are you?")
print(response)
```

## 嵌入模型

查看[使用示例](/oss/integrations/text_embedding/upstage)。

```python
from langchain_upstage import UpstageEmbeddings

embeddings = UpstageEmbeddings(model="solar-embedding-1-large")
doc_result = embeddings.embed_documents(
    ["Sung is a professor.", "This is another document"]
)
print(doc_result)

query_result = embeddings.embed_query("What does Sung do?")
print(query_result)
```

## 文档加载器

### Document Parse

查看[使用示例](/oss/integrations/document_loaders/upstage)。

```python
from langchain_upstage import UpstageDocumentParseLoader

file_path = "/PATH/TO/YOUR/FILE.pdf"
layzer = UpstageDocumentParseLoader(file_path, split="page")

# 为了提高内存效率，可以考虑使用 lazy_load 方法逐页加载文档。
docs = layzer.load()  # 或 layzer.lazy_load()

for doc in docs[:3]:
    print(doc)
```

## 工具

### Groundedness Check

查看[使用示例](/oss/integrations/tools/upstage_groundedness_check)。

```python
from langchain_upstage import UpstageGroundednessCheck

groundedness_check = UpstageGroundednessCheck()

request_input = {
    "context": "Mauna Kea is an inactive volcano on the island of Hawaii. Its peak is 4,207.3 m above sea level, making it the highest point in Hawaii and second-highest peak of an island on Earth.",
    "answer": "Mauna Kea is 5,207.3 meters tall.",
}
response = groundedness_check.invoke(request_input)
print(response)
```
