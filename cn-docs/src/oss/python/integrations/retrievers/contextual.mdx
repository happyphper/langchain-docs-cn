---
title: 上下文感知 AI 重排序器
---
Contextual AI 的指令遵循重排序器（Instruction-Following Reranker）是全球首个能够遵循自定义指令的重排序器，它可以根据特定标准（如时效性、来源和元数据）来优先处理文档。它在 BEIR 基准测试中表现出色（得分 61.2，远超竞争对手），为企业 RAG 应用提供了前所未有的控制力和准确性。

## 核心能力

- **指令遵循**：通过自然语言指令动态控制文档排序
- **冲突解决**：智能处理来自多个知识源的矛盾信息
- **卓越准确性**：在行业基准测试中达到最先进的性能
- **无缝集成**：可作为现有 RAG 流程中重排序器的直接替代品

该重排序器擅长解决企业知识库中的实际挑战，例如优先处理新文档而非过时文档，或优先考虑内部文档而非外部来源。

要了解更多关于我们的指令遵循重排序器并查看实际示例，请访问我们的[产品概述](https://contextual.ai/blog/introducing-instruction-following-reranker/)。

有关 Contextual AI 产品的完整文档，请访问我们的[开发者门户](https://docs.contextual.ai/)。

此集成需要 `contextual-client` Python SDK。了解更多信息请点击[此处](https://github.com/ContextualAI/contextual-client-python)。

## 概述

此集成调用 Contextual AI 的 Grounded Language Model。

### 集成详情

| 类 | 包 | 本地 | 可序列化 | JS 支持 | 下载量 | 版本 |
| :--- | :--- | :---: | :---: |  :---: | :---: | :---: |
| [ContextualRerank](https://python.langchain.com/api_reference/en/latest/chat_models/langchain_contextual.rerank.ContextualRerank.html) | [langchain-contextual](https://python.langchain.com/api_reference/en/latest/contextual_api_reference.html) | ❌ | beta | ❌ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-contextual?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-contextual?style=flat-square&label=%20) |

## 设置

要访问 Contextual 的重排序器模型，您需要创建一个 Contextual AI 账户，获取 API 密钥，并安装 `langchain-contextual` 集成包。

### 凭证

前往 [app.contextual.ai](https://app.contextual.ai) 注册 Contextual 并生成 API 密钥。完成后，设置 CONTEXTUAL_AI_API_KEY 环境变量：

```python
import getpass
import os

if not os.getenv("CONTEXTUAL_AI_API_KEY"):
    os.environ["CONTEXTUAL_AI_API_KEY"] = getpass.getpass(
        "Enter your Contextual API key: "
    )
```

## 安装

LangChain Contextual 集成位于 `langchain-contextual` 包中：

```python
pip install -qU langchain-contextual
```

## 实例化

Contextual 重排序器的参数如下：

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| documents | list[Document] | 要重新排序的文档序列。文档中包含的任何元数据也将用于重排序。 |
| query | str | 用于重排序的查询。 |
| model | str | 要使用的重排序器版本。目前，我们只有 "ctxl-rerank-en-v1-instruct"。 |
| top_n | Optional[int] | 要返回的结果数量。如果为 None，则返回所有结果。默认为 self.top_n。 |
| instruction | Optional[str] | 用于重排序器的指令。 |
| callbacks | Optional[Callbacks] | 压缩过程中运行的回调函数。 |

```python
from langchain_contextual import ContextualRerank

api_key = ""
model = "ctxl-rerank-en-v1-instruct"

compressor = ContextualRerank(
    model=model,
    api_key=api_key,
)
```

## 使用

首先，我们将设置我们将使用的全局变量和示例，并实例化我们的重排序器客户端。

```python
from langchain_core.documents import Document

query = "What is the current enterprise pricing for the RTX 5090 GPU for bulk orders?"
instruction = "Prioritize internal sales documents over market analysis reports. More recent documents should be weighted higher. Enterprise portal content supersedes distributor communications."

document_contents = [
    "Following detailed cost analysis and market research, we have implemented the following changes: AI training clusters will see a 15% uplift in raw compute performance, enterprise support packages are being restructured, and bulk procurement programs (100+ units) for the RTX 5090 Enterprise series will operate on a $2,899 baseline.",
    "Enterprise pricing for the RTX 5090 GPU bulk orders (100+ units) is currently set at $3,100-$3,300 per unit. This pricing for RTX 5090 enterprise bulk orders has been confirmed across all major distribution channels.",
    "RTX 5090 Enterprise GPU requires 450W TDP and 20% cooling overhead.",
]

metadata = [
    {
        "Date": "January 15, 2025",
        "Source": "NVIDIA Enterprise Sales Portal",
        "Classification": "Internal Use Only",
    },
    {"Date": "11/30/2023", "Source": "TechAnalytics Research Group"},
    {
        "Date": "January 25, 2025",
        "Source": "NVIDIA Enterprise Sales Portal",
        "Classification": "Internal Use Only",
    },
]

documents = [
    Document(page_content=content, metadata=metadata[i])
    for i, content in enumerate(document_contents)
]
reranked_documents = compressor.compress_documents(
    query=query,
    instruction=instruction,
    documents=documents,
)
```

## 在链中使用

示例即将推出。

---

## API 参考

有关 ChatContextual 所有功能和配置的详细文档，请访问 GitHub 页面：[github.com/ContextualAI//langchain-contextual](https://github.com/ContextualAI//langchain-contextual)
