---
title: TeradataVectorStore
---
>Teradata Vector Store 专为在企业数据平台内高效存储、索引和搜索高维向量嵌入而设计。

本指南将向您展示如何快速启动并运行 TeradataVectorStore，以用于您的语义搜索和 RAG 应用。无论您是 Teradata 的新手，还是希望为现有数据工作流添加 AI 能力，本指南都将引导您了解所需的一切。

**TeradataVectorStore 有何特别之处？**
- 构建于企业级的 Teradata Vantage 平台之上。
- 与您现有的数据仓库无缝集成。
- 支持多种向量搜索算法，适用于不同用例。
- 可从原型扩展到生产工作负载。

## 设置

在深入之前，您需要安装必要的软件包。TeradataVectorStore 是 `langchain-teradata` 包的一部分，该包还包含 LangChain 的其他 Teradata 集成。

**初次接触 Teradata？** 请参考：
- [Teradata VantageCloud Lake](https://www.teradata.com/platform/vantagecloud)
- [VantageCloud Lake 入门指南](https://docs.teradata.com/r/Lake-Getting-Started-with-VantageCloud-Lake/)

### 安装

```python [pip]
pip install langchain-teradata
```

### 凭证

**连接到 Teradata：** `create_context()` 函数建立您与 Teradata Vantage 系统的连接。这就是 teradataml（以及延伸的 TeradataVectorStore）知道要连接到哪个数据库并进行身份验证的方式。

**您需要准备：**
- **hostname**: 您的 Teradata 系统地址
- **username/password**: 您的数据库凭证
- **base_url**: 您的 Teradata 系统的 API 端点
- **pat_token**: 用于 API 身份验证的个人访问令牌
- **pem_file**: 用于安全连接的 SSL 证书文件

**更多信息** 请查看 [Teradata Vector Store 用户指南](https://docs.teradata.com/r/Enterprise_IntelliFlex_VMware/Teradata-Vector-Store-User-Guide/Setting-up-Vector-Store/Required-Privileges) 获取详细的设置说明。

**关于 teradataml 的信息** 请参考 [TeradataML 用户指南](https://docs.teradata.com/r/Enterprise_IntelliFlex_VMware/Teradata-Package-for-Python-User-Guide/Introduction-to-Teradata-Package-for-Python)

```python
import os
from getpass import getpass
from teradataml import create_context

os.environ['TD_HOST'] = getpass(prompt='hostname: ')
os.environ['TD_USERNAME'] = getpass(prompt='username: ')
os.environ['TD_PASSWORD'] = getpass(prompt='password: ')
os.environ['TD_BASE_URL'] = getpass(prompt='base_url: ')
os.environ['TD_PAT_TOKEN'] = getpass(prompt='pat_token: ')
os.environ['TD_PEM_FILE'] = getpass(prompt='pem_file: ')
create_context()
```

---

## 实例化

**初始化您的嵌入模型**

**TeradataVectorStore 支持三种类型的嵌入对象：**
1. **字符串标识符** (例如，"amazon.titan-embed-text-v1")
2. **TeradataAI 对象**
3. **LangChain 嵌入对象** - 与 LangChain 兼容的嵌入模型对象

```python
# 初始化嵌入模型
from langchain_aws import BedrockEmbeddings
embeddings = BedrockEmbeddings(model_id="amazon.titan-embed-text-v1", region_name="us-west-2")
```

**创建您的第一个向量存储**

让我们从一些示例文档开始，创建一个向量存储。`from_documents()` 方法是入门最直接的方式之一——只需传入您的文档，TeradataVectorStore 会处理其余部分。

**底层发生了什么：**
- 您的文档被转换为 Teradataml Dataframe 并传递给向量存储
- 为每个 Document 对象生成并存储嵌入向量
- 自动创建索引以支持快速相似性搜索和聊天操作

```python
from langchain_teradata import TeradataVectorStore
from langchain_core.documents import Document
# 关于不同主题的示例文档
docs = [
    Document(page_content="Teradata provides scalable data analytics solutions for enterprises."),
    Document(page_content="Machine learning models require high-quality training data to perform well."),
    Document(page_content="Vector databases enable semantic search capabilities beyond keyword matching."),
    Document(page_content="LangChain simplifies building applications with large language models."),
    Document(page_content="Data warehousing has evolved to support real-time analytics and AI workloads.")
]

# 创建向量存储
vs = TeradataVectorStore.from_documents(
    name="my_knowledge_base",
    documents=docs,
    embedding=embeddings
)

print("Vector store created successfully!")
```

创建向量存储后，最好验证一切是否设置正确。TeradataVectorStore 提供了有用的方法来监控您的操作并了解幕后发生的情况。

**为什么要检查状态？**
- **操作跟踪**：准确查看向量存储创建处于哪个阶段。
- **故障排除**：快速识别设置过程中是否出现问题。
- **进度监控**：对于大型数据集，跟踪嵌入生成进度。
- **验证**：确认您的向量存储已准备好进行查询。

```python
# 检查存储的状态。
vs.status()
```

想看看向量存储里到底有什么吗？`get_details()` 方法为您提供了设置的全面概览——可以把它看作是您向量存储的“仪表板”。

**您将看到：**
- **对象清单**：您已添加的表或文档数量。
- **搜索参数**：当前算法设置（HNSW、K-means 等）
- **配置详情**：嵌入维度、距离度量和索引选项。
- **性能设置**：Top-k 值、相似性阈值和其他查询参数。

```python
vs.get_details()
```

---

## 管理向量存储

### 向向量存储添加项目

TeradataVectorStore 的最佳特性之一是扩展知识库的便捷性。随着业务增长和文档增多，您可以持续添加它们，而无需从头开始重建一切。

**实际场景：**
- 创建新产品文档时添加。
- 包含新的研究论文或行业报告。
- 整合客户反馈和支持文档。
- 更新最新的政策或程序变更。

**企业优势**：由于一切都在 Teradata 上运行，您可以轻松地从现有表、数据仓库或实时数据流中添加数据，而无需复杂的数据迁移。

```python
# 添加更多文档
additional_docs = [
    Document(page_content="Retrieval-augmented generation combines the power of search with language models."),
    Document(page_content="Teradata's vector capabilities support both structured and unstructured data analysis.")
]

vs.add_documents(documents=additional_docs)
print("Added more knowledge to the vector store!")
```

```python
# 检查新存储的状态。
vs.status()
```

---

## 查询向量存储

一旦您的向量存储创建完成并添加了相关文档，您很可能希望在运行链或代理时查询它。

### 直接查询

现在让我们在向量存储中搜索信息。与传统的关键词搜索不同，向量搜索能理解您问题背后的含义。询问“AI 应用”，它可能会返回关于“机器学习模型”的结果，因为它理解这些概念是相关的。

**相似性搜索的工作原理：**
- 您的问题被转换为向量嵌入（就像您的文档一样）。
- TeradataVectorStore 计算您的问题与存储文档之间的相似性分数。
- 返回最相关的结果，并按相似性排序。

```python
# 提问
question = "What are vector databases?"
results = vs.similarity_search(question=question, return_type = "json")

print("Found relevant information:")
for result in results.similar_objects:
    print(f" {result}")
```

### 转换为检索器进行查询

您也可以将向量存储转换为检索器，以便在链中更轻松地使用。

```python
# 为您的 RAG 管道创建一个检索器
retriever = vs.as_retriever(search_type="similarity")

# 测试检索器
retrieved_docs = retriever.invoke("Tell me about Teradata's capabilities")

print("Retrieved documents for RAG:")
for doc in retrieved_docs:
    print(f"- {doc.page_content}")
```

---

## 用于检索增强生成

`ask()` 方法结合了向量搜索和语言模型生成的能力。您得到的不是原始的文档片段，而是连贯、有上下文的答案。

**两步流程：**
1. **检索**：从您的向量存储中找到最相关的文档。
2. **生成**：使用这些文档作为上下文来生成自然语言响应。

**其强大之处在于**：您的 AI 响应基于您的实际数据，减少了幻觉并确保了准确性。这就像拥有一位知识渊博的助手，它确实阅读了您公司的文档！

```python
# 获取全面的答案
response = vs.ask(question="What are the benefits of using vector databases?")
print("AI Response:")
print(response)
```

检索增强生成（RAG）是驱动大多数现代 AI 助手和聊天机器人的技术。TeradataVectorStore 与 LangChain 无缝集成，使构建 RAG 应用变得简单直接。

**一个好的 RAG 应用的特点：**
- **相关检索**：您的向量存储能找到正确的信息。
- **上下文生成**：语言模型能有效地使用这些信息。
- **来源透明**：用户可以查看答案的来源。

**与 TeradataVectorStore 的协作方式**：
- 您可以将向量存储用作检索器来获取最相关的文档，然后将这些文档传递给 LangChain 工作流中的 RAG 链。
- 这为您提供了构建自定义管道的灵活性，同时利用 Teradata 强大的向量搜索能力。

现在，让我们构建一个完整的 RAG 管道，将您的 TeradataVectorStore 检索器与语言模型结合起来。这展示了 RAG 的全部威力——从向量存储中检索相关信息，并用它来生成有依据的响应。

**此管道中发生的情况：**

- 检索：您的向量存储为问题找到最相关的文档。
- 上下文准备：这些文档成为语言模型的上下文。
- 生成：语言模型基于您的实际数据生成答案。
- 输出解析：为您的应用准备好干净、格式化的响应。

**实际应用：**

- 客户支持：使用您的产品文档回答问题。
- 研究辅助：查询您组织的知识库。
- 合规性：确保响应基于公司批准的信息。

```python
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.chat_models import init_chat_model

#示例：简单的 RAG 链
# 初始化聊天模型
llm = init_chat_model("anthropic.claude-3-5-sonnet-20240620-v1:0", 
                      model_provider="bedrock_converse", 
                      region_name="<ENTER REGION>",
                      aws_access_key_id = "<ENTER AWS ACCESS KEY>" ,
                      aws_secret_access_key = "<ENTER AWS SECRET KEY>"
                      )

# 为 LLM 创建一个提示模板，使其能使用检索到的上下文来格式化其响应
prompt = PromptTemplate.from_template(
    "Use the following context to answer the question.\nContext:\n{context}\n\nQuestion: {question}\nAnswer:"
)

# 构建 RAG 链：检索上下文、格式化提示、生成答案、解析输出
rag_chain = (
    {
        "context": retriever,
        "question": RunnablePassthrough()
    }
    | prompt
    | llm
    | StrOutputParser()
)

# 使用示例问题调用 RAG 链并打印响应
response = rag_chain.invoke("Benefits of Vector Store")
print(response)
```

---

## 处理不同的数据类型

当处理不同类型的数据源时，TeradataVectorStore 的灵活性真正得以体现。根据您的起点，您可以选择最合适的方法。

**选择您的起点：**
- **有 PDF 文档？** 使用 `from_documents()` 并传入文件路径
- **处理数据库表？** 使用 `from_datasets()` 并传入 DataFrames
- **已有嵌入向量？** 使用 `from_embeddings()` 直接导入它们

### 从 PDF 文件

```python
# 基于文件的向量存储，从 PDF 创建
pdf_vs = TeradataVectorStore.from_documents(
    name="pdf_knowledge",
    documents="path/to/your/document.pdf",  # 或 PDF 路径列表
    embedding=embeddings
)
```

### 从数据库表

```python
# 基于内容的向量存储，从现有表创建
from teradataml import DataFrame
table_data = DataFrame('your_table_name')

table_vs = TeradataVectorStore.from_datasets(
    name="table_knowledge", 
    data=table_data,
    data_columns=["text_column"],
    embedding=embeddings
)
```

### 从预计算的嵌入向量

```python
# 如果您已经有嵌入向量
embedding_vs = TeradataVectorStore.from_embeddings(
    name="embedding_store",
    data=your_embedding_data,
    data_columns="embedding_column"
)
```

***注意*** <br />
当处理表（以及嵌入表）时，`data_columns` 参数是必需的。这告诉 TeradataVectorStore 哪些列包含您想要转换为嵌入向量的文本内容。可以将其视为将服务指向正确的信息。

例如，如果您的表有 id、title、description 和 category 等列，您可以指定 data_columns=["description"] 来仅嵌入描述文本，或者指定 data_columns=["title", "description"] 来组合两个字段。

下面是一个使用 `teradatagenai` 加载示例表并从中创建基于内容的存储的小例子。对于 data_columns，我们将传递 "rev_text" 列，该列将用于生成嵌入向量。

```python
from teradatagenai import load_data

# 将示例数据加载到 Teradata 中
load_data("byom", "amazon_reviews_25")

# 从 Teradata 表创建向量存储
td_vs = TeradataVectorStore.from_datasets(
    name="table_store_amazon",
    data="amazon_reviews_25",
    data_columns="rev_text",
    embedding=embeddings)
```

```python
# 检查新存储的状态
td_vs.status()
```

---

## 后续步骤

恭喜！您刚刚使用 TeradataVectorStore 构建了您的第一个 AI 驱动的搜索和 RAG 系统。您现在已准备好将其扩展到处理真实的企业工作负载。

**准备深入探索？**
- **高级搜索算法**：尝试 HNSW 或 K-means 聚类以进行大规模部署
- **自定义嵌入模型**：为您的行业试验特定领域的嵌入模型
- **实时更新**：设置管道以在新数据到达时自动更新您的向量存储

**生产环境注意事项：**
- **安全性**：利用 Teradata 的企业安全特性
- **监控**：使用 Teradata 内置的性能监控

**了解更多：**
- [LangChain RAG 教程](https://python.langchain.com/docs/tutorials/rag) - 深入探讨 RAG 模式
- [TeradataVectorStore 工作流](https://github.com/Teradata/langchain-teradata) - 完整的示例和用例
- [VantageCloud Lake](https://www.teradata.com/platform/vantagecloud) - 云原生分析平台

---

## API 参考

有关所有 TeradataVectorStore 特性和配置的详细文档，请前往 API 参考。
[langchain-teradata 用户指南](https://docs.teradata.com/search/documents?query=Teradata+Package+for+LangChain&sort=last_update&virtual-field=title_only&content-lang=en-US)
