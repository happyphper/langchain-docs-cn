---
title: 组件架构
---
LangChain 的强大之处在于其组件如何协同工作以构建复杂的 AI 应用程序。本页通过图表展示了不同组件之间的关系。

## 核心组件生态系统

下图展示了 LangChain 的主要组件如何连接以形成完整的 AI 应用程序：

```mermaid
graph TD
    %% Input processing
    subgraph "📥 Input processing"
        A[Text input] --> B[Document loaders]
        B --> C[Text splitters]
        C --> D[Documents]
    end

    %% Embedding & storage
    subgraph "🔢 Embedding & storage"
        D --> E[Embedding models]
        E --> F[Vectors]
        F --> G[(Vector stores)]
    end

    %% Retrieval
    subgraph "🔍 Retrieval"
        H[User Query] --> I[Embedding models]
        I --> J[Query vector]
        J --> K[Retrievers]
        K --> G
        G --> L[Relevant context]
    end

    %% Generation
    subgraph "🤖 Generation"
        M[Chat models] --> N[Tools]
        N --> O[Tool results]
        O --> M
        L --> M
        M --> P[AI response]
    end

    %% Orchestration
    subgraph "🎯 Orchestration"
        Q[Agents] --> M
        Q --> N
        Q --> K
        Q --> R[Memory]
    end
```

### 组件如何连接

每个组件层都建立在前一层之上：

1.  **输入处理** – 将原始数据转换为结构化文档
2.  **嵌入与存储** – 将文本转换为可搜索的向量表示
3.  **检索** – 根据用户查询查找相关信息
4.  **生成** – 使用 AI 模型创建响应，可选择使用工具
5.  **编排** – 通过智能体（Agent）和记忆系统协调所有组件

## 组件类别

LangChain 将组件组织到以下几个主要类别中：

| 类别 | 目的 | 关键组件 | 使用场景 |
|----------|---------|---------------|-----------|
| **[模型](/oss/langchain/models)** | AI 推理与生成 | 聊天模型、LLMs、嵌入模型 | 文本生成、推理、语义理解 |
| **[工具](/oss/langchain/tools)** | 外部能力 | API、数据库等 | 网络搜索、数据访问、计算 |
| **[智能体](/oss/langchain/agents)** | 编排与推理 | ReAct 智能体、工具调用智能体 | 非确定性工作流、决策制定 |
| **[记忆](/oss/langchain/short-term-memory)** | 上下文保持 | 消息历史、自定义状态 | 对话、有状态的交互 |
| **[检索器](/oss/integrations/retrievers)** | 信息访问 | 向量检索器、网络检索器 | RAG、知识库搜索 |
| **[文档处理](/oss/integrations/document_loaders)** | 数据摄取 | 加载器、分割器、转换器 | PDF 处理、网络抓取 |
| **[向量存储](/oss/integrations/vectorstores)** | 语义搜索 | Chroma、Pinecone、FAISS | 相似性搜索、嵌入存储 |

## 常见模式

### RAG（检索增强生成）

```mermaid
graph LR
    A[User question] --> B[Retriever]
    B --> C[Relevant docs]
    C --> D[Chat model]
    A --> D
    D --> E[Informed response]
```

### 带工具的智能体

```mermaid
graph LR
    A[User request] --> B[Agent]
    B --> C{Need tool?}
    C -->|Yes| D[Call tool]
    D --> E[Tool result]
    E --> B
    C -->|No| F[Final answer]
```

### 多智能体系统

```mermaid
graph LR
    A[Complex Task] --> B[Supervisor agent]
    B --> C[Specialist agent 1]
    B --> D[Specialist agent 2]
    C --> E[Results]
    D --> E
    E --> B
    B --> F[Coordinated response]
```

## 了解更多

现在您已经了解了组件之间的关系，可以探索具体领域：

-   [构建您的第一个 RAG 系统](/oss/langchain/knowledge-base)
-   [创建智能体](/oss/langchain/agents)
-   [使用工具](/oss/langchain/tools)
-   [设置记忆](/oss/langchain/short-term-memory)
-   [浏览集成](/oss/integrations/providers/overview)
