---
title: AWS（亚马逊）
---
本页面涵盖了 LangChain 与 [Amazon Web Services (AWS)](https://aws.amazon.com/) 平台的所有集成。

## 聊天模型

### Bedrock 聊天

>[Amazon Bedrock](https://aws.amazon.com/bedrock/) 是一项完全托管的服务，通过单一 API 提供来自领先 AI 公司（如 `AI21 Labs`、`Anthropic`、`Cohere`、`Meta`、`Stability AI` 和 `Amazon`）的高性能基础模型（FMs）选择，以及构建具有安全性、隐私性和负责任 AI 的生成式 AI 应用程序所需的一系列广泛功能。使用 `Amazon Bedrock`，您可以轻松地针对您的用例试验和评估顶级 FM，使用微调和`检索增强生成`（`RAG`）等技术，利用您的数据对它们进行私有化定制，并构建利用您的企业系统和数据源执行任务的智能体（agent）。由于 `Amazon Bedrock` 是无服务器的，您无需管理任何基础设施，并且可以使用您已经熟悉的 AWS 服务，安全地将生成式 AI 功能集成并部署到您的应用程序中。

查看[使用示例](/oss/python/integrations/chat/bedrock)。

```python
from langchain_aws import ChatBedrock
```

### Bedrock Converse
AWS Bedrock 维护着一个 [Converse API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)，为 Bedrock 模型提供统一的对话接口。此 API 目前尚不支持自定义模型。您可以在此处查看所有[支持的模型列表](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html)。

<Info>

<strong>对于不需要使用自定义模型的用户，我们推荐使用 Converse API。可以通过 [ChatBedrockConverse](https://python.langchain.com/api_reference/aws/chat_models/langchain_aws.chat_models.bedrock_converse.ChatBedrockConverse.html) 访问。</strong>

</Info>

查看[使用示例](/oss/python/integrations/chat/bedrock)。

```python
from langchain_aws import ChatBedrockConverse
```

## 大语言模型（LLMs）

### Bedrock

查看[使用示例](/oss/python/integrations/llms/bedrock)。

```python
from langchain_aws import BedrockLLM
```

### Amazon API Gateway

>[Amazon API Gateway](https://aws.amazon.com/api-gateway/) 是一项完全托管的服务，使开发人员能够轻松创建、发布、维护、监控和保护任何规模的 API。API 充当应用程序访问后端服务数据、业务逻辑或功能的"前门"。使用 `API Gateway`，您可以创建 RESTful API 和 WebSocket API，以实现实时双向通信应用程序。`API Gateway` 支持容器化、无服务器工作负载以及 Web 应用程序。
>
>`API Gateway` 处理接受和处理高达数十万并发 API 调用所涉及的所有任务，包括流量管理、CORS 支持、授权和访问控制、节流、监控和 API 版本管理。`API Gateway` 没有最低费用或启动成本。您只需为接收的 API 调用和传输出的数据量付费，并且借助 `API Gateway` 的分层定价模型，您可以随着 API 使用量的增加而降低成本。

查看[使用示例](/oss/python/integrations/llms/amazon_api_gateway)。

```python
from langchain_community.llms import AmazonAPIGateway
```

### SageMaker 终端节点

>[Amazon SageMaker](https://aws.amazon.com/sagemaker/) 是一个系统，可以使用完全托管的基础设施、工具和工作流程来构建、训练和部署机器学习（ML）模型。

我们使用 `SageMaker` 来托管我们的模型，并将其作为 `SageMaker Endpoint` 公开。

查看[使用示例](/oss/python/integrations/llms/sagemaker)。

```python
from langchain_aws import SagemakerEndpoint
```

## 嵌入模型

### Bedrock

查看[使用示例](/oss/python/integrations/text_embedding/bedrock)。

```python
from langchain_aws import BedrockEmbeddings
```

### SageMaker 端点

查看[使用示例](/oss/python/integrations/text_embedding/sagemaker-endpoint)。

```python
from langchain_community.embeddings import SagemakerEndpointEmbeddings
from langchain_community.llms.sagemaker_endpoint import ContentHandlerBase
```

## 文档加载器

### AWS S3 目录和文件

>[Amazon Simple Storage Service (Amazon S3)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-folders.html)
> 是一项对象存储服务。
>[AWS S3 目录](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-folders.html)
>[AWS S3 存储桶](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html)

查看 [S3DirectoryLoader 的使用示例](/oss/python/integrations/document_loaders/aws_s3_directory)。

查看 [S3FileLoader 的使用示例](/oss/python/integrations/document_loaders/aws_s3_file)。

```python
from langchain_community.document_loaders import S3DirectoryLoader, S3FileLoader
```

### Amazon Textract

>[Amazon Textract](https://docs.aws.amazon.com/managedservices/latest/userguide/textract.html) 是一项机器学习 (ML) 服务，可自动从扫描文档中提取文本、手写内容和数据。

查看[使用示例](/oss/python/integrations/document_loaders/amazon_textract)。

```python
from langchain_community.document_loaders import AmazonTextractPDFLoader
```

### Amazon Athena

>[Amazon Athena](https://aws.amazon.com/athena/) 是一项基于开源框架构建的无服务器交互式分析服务，支持开放表和文件格式。

查看[使用示例](/oss/python/integrations/document_loaders/athena)。

```python
from langchain_community.document_loaders.athena import AthenaLoader
```

### AWS Glue

>[AWS Glue Data Catalog](https://docs.aws.amazon.com/en_en/glue/latest/dg/catalog-and-crawler.html) 是一个集中式元数据存储库，允许您管理、访问和共享存储在 AWS 中的数据元数据。它充当数据资产的元数据存储，使各种 AWS 服务和您的应用程序能够高效地查询和连接到所需的数据。

查看[使用示例](/oss/python/integrations/document_loaders/glue_catalog)。

```python
from langchain_community.document_loaders.glue_catalog import GlueCatalogLoader
```

## 向量存储

### Amazon OpenSearch Service

> [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) 执行交互式日志分析、实时应用程序监控、网站搜索等。`OpenSearch` 是一个开源、分布式的搜索和分析套件，源自 `Elasticsearch`。`Amazon OpenSearch Service` 提供最新版本的 `OpenSearch`、对许多 `Elasticsearch` 版本的支持，以及由 `OpenSearch Dashboards` 和 `Kibana` 提供支持的可视化功能。

我们需要安装几个 Python 库。

::: code-group

```bash [pip]
pip install boto3 requests requests-aws4auth
```

```bash [uv]
uv add boto3 requests requests-aws4auth
```

:::

查看[使用示例](/oss/python/integrations/vectorstores/opensearch#using-aos-amazon-opensearch-service)。

```python
from langchain_community.vectorstores import OpenSearchVectorSearch
```

### Amazon DocumentDB 向量搜索

>[Amazon DocumentDB (with MongoDB Compatibility)](https://docs.aws.amazon.com/documentdb/) 让在云端设置、操作和扩展与 MongoDB 兼容的数据库变得简单。
> 使用 Amazon DocumentDB，您可以运行相同的应用程序代码，并使用与 MongoDB 相同的驱动程序和工具。
> Amazon DocumentDB 的向量搜索功能结合了基于 JSON 的文档数据库的灵活性和丰富的查询能力，以及向量搜索的强大功能。

#### 安装与设置

查看 [详细配置说明](/oss/python/integrations/vectorstores/documentdb)。

我们需要安装 `pymongo` Python 包。

::: code-group

```bash [pip]
pip install pymongo
```

```bash [uv]
uv add pymongo
```

:::

#### 在 AWS 上部署 DocumentDB

[Amazon DocumentDB (with MongoDB Compatibility)](https://docs.aws.amazon.com/documentdb/) 是一个快速、可靠且完全托管的数据库服务。Amazon DocumentDB 让在云端设置、操作和扩展与 MongoDB 兼容的数据库变得简单。

AWS 提供计算、数据库、存储、分析和其他功能的服务。有关所有 AWS 服务的概述，请参阅 [使用 Amazon Web Services 进行云计算](https://aws.amazon.com/what-is-aws/)。

查看 [使用示例](/oss/python/integrations/vectorstores/documentdb)。

```python
from langchain_community.vectorstores import DocumentDBVectorSearch
```
### Amazon MemoryDB

[Amazon MemoryDB](https://aws.amazon.com/memorydb/) 是一个持久的内存数据库服务，可提供超快的性能。MemoryDB 与流行的开源数据存储 Redis OSS 兼容，
使您能够使用与今天相同的灵活友好的 Redis OSS API 和命令快速构建应用程序。

InMemoryVectorStore 类提供了一个向量存储来连接 Amazon MemoryDB。

```python
from langchain_aws.vectorstores.inmemorydb import InMemoryVectorStore

vds = InMemoryVectorStore.from_documents(
            chunks,
            embeddings,
            redis_url="rediss://cluster_endpoint:6379/ssl=True ssl_cert_reqs=none",
            vector_schema=vector_schema,
            index_name=INDEX_NAME,
        )
```
查看 [使用示例](/oss/python/integrations/vectorstores/memorydb)。

## 检索器

### Amazon kendra

> [Amazon Kendra](https://docs.aws.amazon.com/kendra/latest/dg/what-is-kendra.html) 是 `Amazon Web Services` (`AWS`) 提供的一项智能搜索服务。
> 它利用先进的自然语言处理 (NLP) 和机器学习算法，在组织内的各种数据源中实现强大的搜索功能。
> `Kendra` 旨在帮助用户快速准确地找到所需信息，从而提高生产力和决策能力。

> 使用 `Kendra`，我们可以跨多种内容类型进行搜索，包括文档、常见问题解答、知识库、手册和网站。它支持多种语言，能够理解复杂的查询、同义词和上下文含义，以提供高度相关的搜索结果。

我们需要安装 `langchain-aws` 库。

::: code-group

```bash [pip]
pip install langchain-aws
```

```bash [uv]
uv add langchain-aws
```

:::

查看 [使用示例](/oss/python/integrations/retrievers/amazon_kendra_retriever)。

```python
from langchain_aws import AmazonKendraRetriever
```

### Amazon Bedrock (知识库)

> [Amazon Bedrock 知识库](https://aws.amazon.com/bedrock/knowledge-bases/) 是 `Amazon Web Services` (`AWS`) 提供的一项服务，它允许您使用您的私有数据来定制基础模型的响应，从而快速构建 RAG 应用程序。

我们需要安装 `langchain-aws` 库。

::: code-group

```bash [pip]
pip install langchain-aws
```

```bash [uv]
uv add langchain-aws
```

:::

查看 [使用示例](/oss/python/integrations/retrievers/bedrock)。

```python
from langchain_aws import AmazonKnowledgeBasesRetriever
```

## 工具

### AWS lambda

>[`Amazon AWS Lambda`](https://aws.amazon.com/pm/lambda/) 是 `Amazon Web Services` (`AWS`) 提供的一项无服务器计算服务。它帮助开发者构建和运行应用程序及服务，而无需预置或管理服务器。这种无服务器架构使您能够专注于编写和部署代码，而 AWS 会自动处理运行应用程序所需的扩展、打补丁和管理基础设施。

我们需要安装 `boto3` Python 库。

::: code-group

```bash [pip]
pip install boto3
```

```bash [uv]
uv add boto3
```

:::

查看[使用示例](/oss/python/integrations/tools/awslambda)。

```python
from langchain_community.chat_message_histories import DynamoDBChatMessageHistory
```

### Amazon Bedrock AgentCore 浏览器

>[Amazon Bedrock AgentCore 浏览器](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html) 使智能体（agent）能够通过托管的 Chrome 浏览器与网页交互，实现导航、内容提取和网络自动化。

::: code-group

```bash [pip]
pip install langchain-aws bedrock-agentcore playwright beautifulsoup4
```

```bash [uv]
uv add langchain-aws bedrock-agentcore playwright beautifulsoup4
```

:::

查看[使用示例](/oss/python/integrations/tools/bedrock_agentcore_browser)。

```python
from langchain_aws.tools import create_browser_toolkit

# 创建工具包
toolkit, browser_tools = create_browser_toolkit(region="us-west-2")

# 与智能体一起使用
agent = create_react_agent(model=llm, tools=browser_tools)
result = await agent.ainvoke(
    {"messages": [{"role": "user", "content": "Go to example.com and get the heading"}]},
    config={"configurable": {"thread_id": "session-1"}}
)

# 完成后清理
await toolkit.cleanup()
```

### Amazon Bedrock AgentCore 代码解释器

>[Amazon Bedrock AgentCore 代码解释器](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html) 使智能体（agent）能够在安全、托管的沙箱环境中执行 Python、JavaScript 和 TypeScript 代码，用于计算、数据分析和可视化。

::: code-group

```bash [pip]
pip install langchain-aws bedrock-agentcore
```

```bash [uv]
uv add langchain-aws bedrock-agentcore
```

:::

查看[使用示例](/oss/python/integrations/tools/bedrock_agentcore_code_interpreter)。

```python
from langchain_aws.tools import create_code_interpreter_toolkit

# 创建工具包（异步）
toolkit, code_tools = await create_code_interpreter_toolkit(region="us-west-2")

# 与智能体一起使用
agent = create_react_agent(model=llm, tools=code_tools)
result = await agent.ainvoke(
    {"messages": [{"role": "user", "content": "Calculate factorial of 10"}]},
    config={"configurable": {"thread_id": "session-1"}}
)

# 完成后清理
await toolkit.cleanup()
```

## 图数据库

### Amazon Neptune

>[Amazon Neptune](https://aws.amazon.com/neptune/) 是一个高性能图分析和无服务器数据库，具有卓越的可扩展性和可用性。

对于下面的 Cypher 和 SPARQL 集成，我们需要安装 `langchain-aws` 库。

::: code-group

```bash [pip]
pip install langchain-aws
```

```bash [uv]
uv add langchain-aws
```

:::

### 使用 Cypher 的 Amazon Neptune

查看[使用示例](/oss/python/integrations/graphs/amazon_neptune_open_cypher)。

```python
from langchain_aws.graphs import NeptuneGraph
from langchain_aws.graphs import NeptuneAnalyticsGraph
from langchain_aws.chains import create_neptune_opencypher_qa_chain
```

### 使用 SPARQL 的 Amazon Neptune

```python
from langchain_aws.graphs import NeptuneRdfGraph
from langchain_aws.chains import create_neptune_sparql_qa_chain
```

## 记忆（Memory）

### Amazon Bedrock AgentCore 记忆（Memory）

>[Amazon Bedrock AgentCore Memory](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html) 为 LangGraph 智能体提供托管的持久化存储，支持跨会话的对话历史记录和状态管理，并具备自动扩展和高可用性。

::: code-group

```bash [pip]
pip install langgraph-checkpoint-aws
```

```bash [uv]
uv add langgraph-checkpoint-aws
```

:::

```python
from langgraph_checkpoint_aws import AgentCoreMemorySaver

# 创建检查点管理器
checkpointer = AgentCoreMemorySaver(
    memory_id="your-memory-id",
    region_name="us-west-2"
)

# 与 LangGraph 一起使用
graph = workflow.compile(checkpointer=checkpointer)

# 使用 thread_id 和 actor_id 调用以实现对话持久化
config = {
    "configurable": {
        "thread_id": "user-123",
        "actor_id": "my-agent"  # AgentCore 必需
    }
}
result = graph.invoke({"messages": []}, config)
```

主要特性：
- 托管基础设施，无需数据库设置
- 自动扩展和高可用性
- 通过 `actor_id` 隔离实现多智能体支持
- 静态和传输中加密

### Amazon Bedrock AgentCore Memory Store

>[Amazon Bedrock AgentCore Memory Store](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html) 为 LangGraph 智能体提供具备语义搜索能力的长期记忆，支持跨会话存储和检索用户偏好、事实和提取的记忆。

```python
from langgraph_checkpoint_aws import AgentCoreMemoryStore

# 为长期记忆初始化存储
store = AgentCoreMemoryStore(memory_id="your-memory-id", region_name="us-west-2")

# 在模型前钩子中使用以保存和检索记忆
def pre_model_hook(state, config, *, store):
    actor_id = config["configurable"]["actor_id"]
    thread_id = config["configurable"]["thread_id"]
    namespace = (actor_id, thread_id)

    # 保存一条消息
    store.put(namespace, str(uuid.uuid4()), {"message": msg})

    # 搜索相关记忆
    results = store.search(("preferences", actor_id), query="user preferences", limit=5)
    return {"model_input_messages": state["messages"]}
```

## 回调

### Bedrock 令牌使用量

```python
from langchain_community.callbacks.bedrock_anthropic_callback import BedrockAnthropicTokenUsageCallbackHandler
```

### SageMaker 跟踪

>[Amazon SageMaker](https://aws.amazon.com/sagemaker/) 是一项完全托管的服务，用于快速轻松地构建、训练和部署机器学习 (ML) 模型。

>[Amazon SageMaker Experiments](https://docs.aws.amazon.com/sagemaker/latest/dg/experiments.html) 是 `Amazon SageMaker` 的一项功能，可让您组织、跟踪、比较和评估 ML 实验和模型版本。

我们需要安装几个 Python 库。

::: code-group

```bash [pip]
pip install google-search-results sagemaker
```

```bash [uv]
uv add google-search-results sagemaker
```

:::

查看[使用示例](/oss/python/integrations/callbacks/sagemaker_tracking)。

```python
from langchain_community.callbacks import SageMakerCallbackHandler
```

## 链

### Amazon Comprehend 内容审核链

>[Amazon Comprehend](https://aws.amazon.com/comprehend/) 是一项自然语言处理 (NLP) 服务，它使用机器学习来揭示文本中的宝贵见解和联系。

我们需要安装 `boto3` 和 `nltk` 库。

::: code-group

```bash [pip]
pip install boto3 nltk
```

```bash [uv]
uv add boto3 nltk
```

:::

查看[使用示例](https://python.langchain.com/v0.1/docs/guides/productionization/safety/amazon_comprehend_chain/)。

```python
from langchain_experimental.comprehend_moderation import AmazonComprehendModerationChain
```

## 运行时

### Amazon Bedrock AgentCore Runtime

>[Amazon Bedrock AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html) 为 LangGraph 智能体提供托管的、无服务器的执行环境，具备内置的可观测性、自动扩缩容能力，并能与其他 AgentCore 服务无缝集成。

::: code-group

```bash [pip]
pip install bedrock-agentcore
```

```bash [uv]
uv add bedrock-agentcore
```

:::

```python
from bedrock_agentcore.runtime import BedrockAgentCoreApp

app = BedrockAgentCoreApp()

@app.entrypoint
def agent_invocation(payload, context):
    result = graph.invoke({"messages": [{"role": "user", "content": payload["prompt"]}]})
    return {"result": result["messages"][-1].content}

app.run()
```

使用 AgentCore CLI 进行部署：

```bash
# 配置你的智能体
agentcore configure

# 部署到 AgentCore Runtime
agentcore launch -e your_agent.py
```
