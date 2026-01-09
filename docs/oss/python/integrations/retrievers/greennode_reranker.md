---
title: GreenNode
---
>[GreenNode](https://greennode.ai/) 是一家全球人工智能解决方案提供商，同时也是 **NVIDIA 优选合作伙伴**，为美国、中东和北非（MENA）以及亚太（APAC）地区的企业提供从基础设施到应用的全栈 AI 能力。GreenNode 基于 **世界级的基础设施**（LEED 金级认证、TIA‑942、Uptime Tier III）运营，为企业、初创公司和研究人员提供全面的 AI 服务套件。

本指南提供了关于如何开始使用 `GreenNodeRerank` 检索器的详细步骤。它使您能够使用内置连接器或通过集成您自己的数据源来执行文档搜索，并利用 GreenNode 的重新排序能力来提高相关性。

### 集成详情

- **提供商**: [GreenNode Serverless AI](https://aiplatform.console.greennode.ai/playground)
- **模型类型**: 重新排序模型
- **主要用例**: 基于语义相关性对搜索结果进行重新排序
- **可用模型**: 包括 [BAAI/bge-reranker-v2-m3](https://huggingface.co/BAAI/bge-reranker-v2-m3) 和其他高性能重新排序模型
- **评分**: 返回相关性分数，用于根据查询匹配度对候选文档进行重新排序

## 设置

要访问 GreenNode 模型，您需要创建一个 GreenNode 账户，获取一个 API 密钥，并安装 `langchain-greennode` 集成包。

### 凭证

请前往[此页面](https://aiplatform.console.greennode.ai/api-keys)注册 GreenNode AI 平台并生成一个 API 密钥。完成后，设置 `GREENNODE_API_KEY` 环境变量：

```python
import getpass
import os

if not os.getenv("GREENNODE_API_KEY"):
    os.environ["GREENNODE_API_KEY"] = getpass.getpass("Enter your GreenNode API key: ")
```

如果您希望从单个查询中获得自动化追踪，您也可以通过取消注释以下代码来设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

此检索器位于 `langchain-greennode` 包中：

```python
pip install -qU langchain-greennode
```

## 实例化

`GreenNodeRerank` 类可以使用 API 密钥和模型名称等可选参数进行实例化：

```python
from langchain_greennode import GreenNodeRerank

# 初始化嵌入模型
reranker = GreenNodeRerank(
    # api_key="YOUR_API_KEY",  # 您可以直接传入 API 密钥
    model="BAAI/bge-reranker-v2-m3",  # 默认的嵌入模型
    top_n=3,
)
```

## 使用

### 对搜索结果进行重新排序

重新排序模型通过基于语义相关性优化和重新排序初始搜索结果，来增强检索增强生成（RAG）工作流。下面的示例演示了如何将 GreenNodeRerank 与基础检索器集成，以提高检索文档的质量。

```python
from langchain_classic.retrievers.contextual_compression import ContextualCompressionRetriever
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_greennode import GreenNodeEmbeddings

# 初始化嵌入模型
embeddings = GreenNodeEmbeddings(
    # api_key="YOUR_API_KEY",  # 您可以直接传入 API 密钥
    model="BAAI/bge-m3"  # 默认的嵌入模型
)

# 准备文档（金融/经济领域）
docs = [
    Document(
        page_content="Inflation represents the rate at which the general level of prices for goods and services rises"
    ),
    Document(
        page_content="Central banks use interest rates to control inflation and stabilize the economy"
    ),
    Document(
        page_content="Cryptocurrencies like Bitcoin operate on decentralized blockchain networks"
    ),
    Document(
        page_content="Stock markets are influenced by corporate earnings, investor sentiment, and economic indicators"
    ),
]

# 创建向量存储和基础检索器
vector_store = FAISS.from_documents(docs, embeddings)
base_retriever = vector_store.as_retriever(search_kwargs={"k": 4})

rerank_retriever = ContextualCompressionRetriever(
    base_compressor=reranker, base_retriever=base_retriever
)

# 执行带重新排序的检索
query = "How do central banks fight rising prices?"
results = rerank_retriever.get_relevant_documents(query)

results
```

```text
/var/folders/bs/g52lln652z11zjp98qf9wcy40000gn/T/ipykernel_96362/2544494776.py:41: LangChainDeprecationWarning: The method `BaseRetriever.get_relevant_documents` was deprecated in langchain-core 0.1.46 and will be removed in 1.0. Use :meth:`~invoke` instead.
  results = rerank_retriever.get_relevant_documents(query)
```

```text
[Document(metadata={'relevance_score': 0.125}, page_content='Central banks use interest rates to control inflation and stabilize the economy'),
 Document(metadata={'relevance_score': 0.004913330078125}, page_content='Inflation represents the rate at which the general level of prices for goods and services rises'),
 Document(metadata={'relevance_score': 1.6689300537109375e-05}, page_content='Cryptocurrencies like Bitcoin operate on decentralized blockchain networks')]
```

### 直接使用

`GreenNodeRerank` 类可以独立使用，以基于相关性分数对检索到的文档进行重新排序。此功能在以下场景中特别有用：当初步检索步骤（例如，关键词或向量搜索）返回一组广泛的候选结果时，需要一个次级模型来利用更复杂的语义理解来优化结果。该类接受一个查询和一个候选文档列表，并返回一个基于预测相关性重新排序的列表。

```python
test_documents = [
    Document(
        page_content="Carson City is the capital city of the American state of Nevada."
    ),
    Document(
        page_content="Washington, D.C. (also known as simply Washington or D.C.) is the capital of the United States."
    ),
    Document(
        page_content="Capital punishment has existed in the United States since beforethe United States was a country."
    ),
    Document(
        page_content="The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan."
    ),
]

test_query = "What is the capital of the United States?"
results = reranker.rerank(test_documents, test_query)
results
```

```text
[{'index': 1, 'relevance_score': 1.0},
 {'index': 0, 'relevance_score': 0.01165771484375},
 {'index': 3, 'relevance_score': 0.0012054443359375}]
```

## 在链中使用

GreenNodeRerank 可以在 LangChain RAG 管道中无缝工作。以下是一个使用 GreenNodeRerank 创建简单 RAG 链的示例：

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_greennode import ChatGreenNode

# 初始化 LLM
llm = ChatGreenNode(model="deepseek-ai/DeepSeek-R1-Distill-Qwen-32B")

# 创建提示模板
prompt = ChatPromptTemplate.from_template(
    """
Answer the question based only on the following context:

Context:
{context}

Question: {question}
"""
)

# 格式化文档的函数
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# 创建 RAG 链
rag_chain = (
    {"context": rerank_retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 运行链
answer = rag_chain.invoke("How do central banks fight rising prices?")
answer
```

```text
'\n\nCentral banks combat rising prices, or inflation, by adjusting interest rates. By raising interest rates, they increase the cost of borrowing, which discourages spending and investment. This reduction in demand helps slow down the rate of price increases, thereby controlling inflation and contributing to economic stability.'
```

---

## API 参考

有关 GreenNode Serverless AI API 的更多详细信息，请访问 [GreenNode Serverless AI 文档](https://aiplatform.console.greennode.ai/api-docs/maas)。
