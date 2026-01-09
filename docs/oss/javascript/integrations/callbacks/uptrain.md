---
title: UpTrain
---
<a target="_blank" href="https://colab.research.google.com/github/langchain-ai/langchain/blob/v0.3/docs/docs/integrations/callbacks/uptrain.ipynb">
    <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab" />
</a>

> UpTrain [[github](https://github.com/uptrain-ai/uptrain) || [website](https://uptrain.ai/) || [docs](https://docs.uptrain.ai/getting-started/introduction)] 是一个用于评估和改进 LLM 应用的开源平台。它提供了 20 多种预配置检查（涵盖语言、代码、嵌入用例）的评分，对失败案例进行根因分析，并提供解决指导。

## UpTrain 回调处理器

本笔记本展示了 UpTrain 回调处理器如何无缝集成到您的流水线中，以促进多样化的评估。我们选择了一些我们认为适合评估链的评估项。这些评估会自动运行，结果会显示在输出中。有关 UpTrain 评估的更多详细信息，请参阅[此处](https://github.com/uptrain-ai/uptrain?tab=readme-ov-file#pre-built-evaluations-we-offer-)。

我们重点演示了从 LangChain 中选取的几个检索器：

### 1. **基础 RAG**

RAG 在检索上下文和生成响应方面起着至关重要的作用。为确保其性能和响应质量，我们进行以下评估：

- **[上下文相关性](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-relevance)**：判断从查询中提取的上下文是否与响应相关。
- **[事实准确性](https://docs.uptrain.ai/predefined-evaluations/context-awareness/factual-accuracy)**：评估 LLM 是否产生幻觉或提供错误信息。
- **[响应完整性](https://docs.uptrain.ai/predefined-evaluations/response-quality/response-completeness)**：检查响应是否包含查询所要求的所有信息。

### 2. **多查询生成**

MultiQueryRetriever 会生成多个与原始问题含义相似的问题变体。考虑到其复杂性，我们除了包含之前的评估外，还增加了：

- **[多查询准确性](https://docs.uptrain.ai/predefined-evaluations/query-quality/multi-query-accuracy)**：确保生成的多查询与原始查询含义相同。

### 3. **上下文压缩与重排序**

重排序涉及根据与查询的相关性对节点重新排序并选择前 n 个节点。由于重排序完成后节点数量可能会减少，我们执行以下评估：

- **[上下文重排序](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-reranking)**：检查重排序后的节点顺序是否比原始顺序更符合查询的相关性。
- **[上下文简洁性](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-conciseness)**：检查减少后的节点数量是否仍能提供所有必需信息。

这些评估共同确保了链中 RAG、MultiQueryRetriever 和重排序过程的鲁棒性和有效性。

## 安装依赖

```python
pip install -qU langchain langchain_openai langchain-community uptrain faiss-cpu flashrank
```

```text
huggingface/tokenizers: The current process just got forked, after parallelism has already been used. Disabling parallelism to avoid deadlocks...
To disable this warning, you can either:
 - Avoid using `tokenizers` before the fork if possible
 - Explicitly set the environment variable TOKENIZERS_PARALLELISM=(true | false)
```

注意：如果您想使用支持 GPU 的库版本，也可以安装 `faiss-gpu` 而不是 `faiss-cpu`。

## 导入库

```python
from getpass import getpass

from langchain_classic.chains import RetrievalQA
from langchain_classic.retrievers.contextual_compression import ContextualCompressionRetriever
from langchain_classic.retrievers.document_compressors import FlashrankRerank
from langchain_classic.retrievers.multi_query import MultiQueryRetriever
from langchain_community.callbacks.uptrain_callback import UpTrainCallbackHandler
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers.string import StrOutputParser
from langchain_core.prompts.chat import ChatPromptTemplate
from langchain_core.runnables.passthrough import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
)
```

## 加载文档

```python
loader = TextLoader("../../how_to/state_of_the_union.txt")
documents = loader.load()
```

## 将文档分割成块

```python
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
chunks = text_splitter.split_documents(documents)
```

## 创建检索器

```python
embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(chunks, embeddings)
retriever = db.as_retriever()
```

## 定义 LLM

```python
llm = ChatOpenAI(temperature=0, model="gpt-4")
```

## 设置

UpTrain 为您提供：

1. 具有高级钻取和筛选功能的仪表板
2. 失败案例的洞察和常见主题
3. 生产数据的可观测性和实时监控
4. 通过与您的 CI/CD 流水线无缝集成进行回归测试

您可以选择以下选项之一来使用 UpTrain 进行评估：

### 1. **UpTrain 开源软件 (OSS)**

您可以使用开源评估服务来评估您的模型。在这种情况下，您需要提供一个 OpenAI API 密钥。UpTrain 使用 GPT 模型来评估 LLM 生成的响应。您可以在此处获取您的密钥。

为了在 UpTrain 仪表板中查看您的评估结果，您需要通过运行以下命令来设置它：

```bash
git clone https://github.com/uptrain-ai/uptrain
cd uptrain
bash run_uptrain.sh
```

这将在您的本地机器上启动 UpTrain 仪表板。您可以通过 `http://localhost:3000/dashboard` 访问它。

参数：

- key_type="openai"
- api_key="OPENAI_API_KEY"
- project_name="PROJECT_NAME"

### 2. **UpTrain 托管服务和仪表板**

或者，您可以使用 UpTrain 的托管服务来评估您的模型。您可以在此处创建一个免费的 UpTrain 账户并获得免费试用额度。如果您想要更多试用额度，请在此处与 UpTrain 的维护者预约通话。

使用托管服务的好处是：

1. 无需在本地机器上设置 UpTrain 仪表板。
2. 无需 API 密钥即可访问许多 LLM。

执行评估后，您可以在 UpTrain 仪表板中查看它们，地址为 `https://dashboard.uptrain.ai/dashboard`

参数：

- key_type="uptrain"
- api_key="UPTRAIN_API_KEY"
- project_name="PROJECT_NAME"

**注意：** `project_name` 将是评估结果在 UpTrain 仪表板中显示的项目名称。

## 设置 API 密钥

笔记本将提示您输入 API 密钥。您可以通过更改下面单元格中的 `key_type` 参数来选择使用 OpenAI API 密钥或 UpTrain API 密钥。

```python
KEY_TYPE = "openai"  # 或 "uptrain"
API_KEY = getpass()
```

# 1. 基础 RAG

UpTrain 回调处理器将自动捕获查询、上下文和生成的响应，并对响应运行以下三项评估 *(评分范围从 0 到 1)*：

- **[上下文相关性](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-relevance)**：检查从查询中提取的上下文是否与响应相关。
- **[事实准确性](https://docs.uptrain.ai/predefined-evaluations/context-awareness/factual-accuracy)**：检查响应的真实准确性。
- **[响应完整性](https://docs.uptrain.ai/predefined-evaluations/response-quality/response-completeness)**：检查响应是否包含查询所要求的所有信息。

```python
# 创建 RAG 提示词模板
template = """Answer the question based only on the following context, which can include text and tables:
{context}
Question: {question}
"""
rag_prompt_text = ChatPromptTemplate.from_template(template)

# 创建链
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | rag_prompt_text
    | llm
    | StrOutputParser()
)

# 创建 uptrain 回调处理器
uptrain_callback = UpTrainCallbackHandler(key_type=KEY_TYPE, api_key=API_KEY)
config = {"callbacks": [uptrain_callback]}

# 使用查询调用链
query = "What did the president say about Ketanji Brown Jackson"
docs = chain.invoke(query, config=config)
```

```text
2024-04-17 17:03:44.969 | INFO     | uptrain.framework.evalllm:evaluate_on_server:378 - Sending evaluation request for rows 0 to <50 to the Uptrain
2024-04-17 17:04:05.809 | INFO     | uptrain.framework.evalllm:evaluate:367 - Local server not running, start the server to log data and visualize in the dashboard!
```

```text
Question: What did the president say about Ketanji Brown Jackson
Response: The president mentioned that he had nominated Ketanji Brown Jackson to serve on the United States Supreme Court 4 days ago. He described her as one of the nation's top legal minds who will continue Justice Breyer’s legacy of excellence. He also mentioned that she is a former top litigator in private practice, a former federal public defender, and comes from a family of public school educators and police officers. He described her as a consensus builder and noted that since her nomination, she has received a broad range of support from various groups, including the Fraternal Order of Police and former judges appointed by both Democrats and Republicans.

Context Relevance Score: 1.0
Factual Accuracy Score: 1.0
Response Completeness Score: 1.0
```

# 2. 多查询生成

**MultiQueryRetriever** 用于解决 RAG 流水线可能无法根据查询返回最佳文档集的问题。它会生成多个与原始查询含义相同的查询，然后为每个查询获取文档。

为了评估此检索器，UpTrain 将运行以下评估：

- **[多查询准确性](https://docs.uptrain.ai/predefined-evaluations/query-quality/multi-query-accuracy)**：检查生成的多查询是否与原始查询含义相同。

```python
# 创建检索器
multi_query_retriever = MultiQueryRetriever.from_llm(retriever=retriever, llm=llm)

# 创建 uptrain 回调
uptrain_callback = UpTrainCallbackHandler(key_type=KEY_TYPE, api_key=API_KEY)
config = {"callbacks": [uptrain_callback]}

# 创建 RAG 提示词模板
template = """Answer the question based only on the following context, which can include text and tables:
{context}
Question: {question}
"""
rag_prompt_text = ChatPromptTemplate.from_template(template)

chain = (
    {"context": multi_query_retriever, "question": RunnablePassthrough()}
    | rag_prompt_text
    | llm
    | StrOutputParser()
)

# 使用查询调用链
question = "What did the president say about Ketanji Brown Jackson"
docs = chain.invoke(question, config=config)
```

```text
2024-04-17 17:04:10.675 | INFO     | uptrain.framework.evalllm:evaluate_on_server:378 - Sending evaluation request for rows 0 to <50 to the Uptrain
2024-04-17 17:04:16.804 | INFO     | uptrain.framework.evalllm:evaluate:367 - Local server not running, start the server to log data and visualize in the dashboard!
```

```text
Question: What did the president say about Ketanji Brown Jackson
Multi Queries:
  - How did the president comment on Ketanji Brown Jackson?
  - What were the president's remarks regarding Ketanji Brown Jackson?
  - What statements has the president made about Ketanji Brown Jackson?

Multi Query Accuracy Score: 0.5
```

```text
2024-04-17 17:04:22.027 | INFO     | uptrain.framework.evalllm:evaluate_on_server:378 - Sending evaluation request for rows 0 to <50 to the Uptrain
2024-04-17 17:04:44.033 | INFO     | uptrain.framework.evalllm:evaluate:367 - Local server not running, start the server to log data and visualize in the dashboard!
```

```text
Question: What did the president say about Ketanji Brown Jackson
Response: The president mentioned that he had nominated Circuit Court of Appeals Judge Ketanji Brown Jackson to serve on the United States Supreme Court 4 days ago. He described her as one of the nation's top legal minds who will continue Justice Breyer’s legacy of excellence. He also mentioned that since her nomination, she has received a broad range of support—from the Fraternal Order of Police to former judges appointed by Democrats and Republicans.

Context Relevance Score: 1.0
Factual Accuracy Score: 1.0
Response Completeness Score: 1.0
```

# 3. 上下文压缩与重排序

重排序过程涉及根据与查询的相关性对节点重新排序并选择前 n 个节点。由于重排序完成后节点数量可能会减少，我们执行以下评估：

- **[上下文重排序](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-reranking)**：检查重排序后的节点顺序是否比原始顺序更符合查询的相关性。
- **[上下文简洁性](https://docs.uptrain.ai/predefined-evaluations/context-awareness/context-conciseness)**：检查减少后的节点数量是否仍能提供所有必需信息。

```python
# 创建检索器
compressor = FlashrankRerank()
compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor, base_retriever=retriever
)

# 创建链
chain = RetrievalQA.from_chain_type(llm=llm, retriever=compression_retriever)

# 创建 uptrain 回调
uptrain_callback = UpTrainCallbackHandler(key_type=KEY_TYPE, api_key=API_KEY)
config = {"callbacks": [uptrain_callback]}

# 使用查询调用链
query = "What did the president say about Ketanji Brown Jackson"
result = chain.invoke(query, config=config)
```

```text
2024-04-17 17:04:46.462 | INFO     | uptrain.framework.evalllm:evaluate_on_server:378 - Sending evaluation request for rows 0 to <50 to the Uptrain
2024-04-17 17:04:53.561 | INFO     | uptrain.framework.evalllm:evaluate:367 - Local server not running, start the server to log data and visualize in the dashboard!
```

```text
Question: What did the president say about Ketanji Brown Jackson

Context Conciseness Score: 0.0
Context Reranking Score: 1.0
```

```text
2024-04-17 17:04:56.947 | INFO     | uptrain.framework.evalllm:evaluate_on_server:378 - Sending evaluation request for rows 0 to <50 to the Uptrain
2024-04-17 17:05:16.551 | INFO     | uptrain.framework.evalllm:evaluate:367 - Local server not running, start the server to log data and visualize in the dashboard!
```

```text
Question: What did the president say about Ketanji Brown Jackson
Response: The President mentioned that he nominated Circuit Court of Appeals Judge Ketanji Brown Jackson to serve on the United States Supreme Court 4 days ago. He described her as one of the nation's top legal minds who will continue Justice Breyer’s legacy of excellence.

Context Relevance Score: 1.0
Factual Accuracy Score: 1.0
Response Completeness Score: 0.5
```

# UpTrain 的仪表板与洞察

以下是一个展示仪表板和洞察的短视频：

![langchain_uptrain.gif](https://uptrain-assets.s3.ap-south-1.amazonaws.com/images/langchain/langchain_uptrain.gif)
