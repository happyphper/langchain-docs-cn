---
keywords:
  - moorcheh
  - vectorstore
  - semantic-search
  - embeddings
---
# Moorcheh

>[Moorcheh](https://www.moorcheh.ai/) 是一个闪电般快速的语义搜索引擎和向量存储。与使用 L2 或余弦等简单距离度量不同，Moorcheh 使用最大信息二值化 (Maximally Informative Binarization, MIB) 和信息论评分 (Information-Theoretic Score, ITS) 来检索准确的文档片段。

本页介绍如何在 LangChain 中使用 Moorcheh 进行向量存储、语义搜索和生成式 AI 响应。

## 安装与设置

安装 Python 集成包：

```bash
pip install langchain-moorcheh
```

从 [Moorcheh 控制台](https://console.moorcheh.ai/) 获取 Moorcheh API 密钥，并将其设置为环境变量：

```bash
export MOORCHEH_API_KEY="your-api-key-here"
```

## 向量存储

Moorcheh 提供了一个向量存储包装器，允许您高效地存储、搜索和检索文档嵌入。

查看 [详细使用示例](/oss/python/integrations/vectorstores/moorcheh)。

```python
from langchain_moorcheh import MoorchehVectorStore

# 初始化向量存储
store = MoorchehVectorStore(
    api_key="your-api-key",
    namespace="your_namespace",
    namespace_type="text"  # 或 "vector"
)

# 添加文档
from langchain_core.documents import Document
documents = [
    Document(page_content="Your document content here", metadata={"source": "example"})
]
store.add_documents(documents=documents)
```

## 生成式 AI

Moorcheh 支持使用包括 Claude 3 在内的各种 LLM 模型生成 AI 响应，允许您基于存储的文档获取 AI 生成的答案。

```python
# 基于您的文档获取 AI 生成的答案
query = "What are the main topics covered in the documents?"
answer = store.generative_answer(
    query,
    ai_model="anthropic.claude-sonnet-4-5-20250929-v1:0"
)
print(answer)
```

## 核心功能

- **文档管理**：使用唯一 ID 添加和删除文档
- **语义搜索**：使用自然语言查询查找相关文档
- **生成式 AI**：使用各种 LLM 模型获取 AI 生成的答案
- **命名空间组织**：将数据组织到独立的命名空间中
- **元数据支持**：存储和检索带有自定义元数据的文档

有关更详细的示例和高级用法，请参阅 [Moorcheh 向量存储集成](/oss/python/integrations/vectorstores/moorcheh)。
