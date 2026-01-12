---
title: 使用 LangGraph 构建自定义 RAG 代理
sidebarTitle: Custom RAG agent
---
## 概述

在本教程中，我们将使用 LangGraph 构建一个[检索](/oss/python/langchain/retrieval)智能体。

LangChain 提供了内置的[智能体](/oss/python/langchain/agents)实现，这些实现使用了 [LangGraph](/oss/python/langgraph/overview) 原语。如果需要更深度的定制，可以直接在 LangGraph 中实现智能体。本指南演示了一个检索智能体的示例实现。当你希望 LLM 决定是从向量存储中检索上下文还是直接响应用户时，[检索](/oss/python/langchain/retrieval)智能体非常有用。

在本教程结束时，我们将完成以下工作：

1.  获取并预处理将用于检索的文档。
2.  为这些文档建立语义搜索索引，并为智能体创建一个检索器工具。
3.  构建一个能够决定何时使用检索器工具的智能 RAG 系统。

![混合 RAG](/images/langgraph-hybrid-rag-tutorial.png)

### 概念

我们将涵盖以下概念：

-   使用[文档加载器](/oss/python/integrations/document_loaders)、[文本分割器](/oss/python/integrations/splitters)、[嵌入模型](/oss/python/integrations/text_embedding)和[向量存储](/oss/python/integrations/vectorstores)进行[检索](/oss/python/langchain/retrieval)
-   LangGraph 的[图 API](/oss/python/langgraph/graph-api)，包括状态、节点、边和条件边。

## 设置

让我们下载所需的包并设置 API 密钥：

```python
pip install -U langgraph "langchain[openai]" langchain-community langchain-text-splitters bs4
```

```python
import getpass
import os

def _set_env(key: str):
    if key not in os.environ:
        os.environ[key] = getpass.getpass(f"{key}:")

_set_env("OPENAI_API_KEY")
```

<Tip>

注册 LangSmith 以快速发现问题并提升你的 LangGraph 项目性能。[LangSmith](https://docs.smith.langchain.com) 让你能够使用追踪数据来调试、测试和监控你使用 LangGraph 构建的 LLM 应用。

</Tip>

## 1. 预处理文档

1.  获取用于我们 RAG 系统的文档。我们将使用 [Lilian Weng 的优秀博客](https://lilianweng.github.io/) 中最近的三篇文章。我们将首先使用 `WebBaseLoader` 工具获取页面内容：
```python
from langchain_community.document_loaders import WebBaseLoader

urls = [
    "https://lilianweng.github.io/posts/2024-11-28-reward-hacking/",
    "https://lilianweng.github.io/posts/2024-07-07-hallucination/",
    "https://lilianweng.github.io/posts/2024-04-12-diffusion-video/",
]

docs = [WebBaseLoader(url).load() for url in urls]
```
```python
docs[0][0].page_content.strip()[:1000]
```
2.  将获取的文档分割成更小的块，以便索引到我们的向量存储中：
```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

docs_list = [item for sublist in docs for item in sublist]

text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=100, chunk_overlap=50
)
doc_splits = text_splitter.split_documents(docs_list)
```
```python
doc_splits[0].page_content.strip()
```

## 2. 创建检索器工具

现在我们有了分割后的文档，可以将它们索引到一个用于语义搜索的向量存储中。

1.  使用内存向量存储和 OpenAI 嵌入模型：
```python
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import OpenAIEmbeddings

vectorstore = InMemoryVectorStore.from_documents(
    documents=doc_splits, embedding=OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever()
```
2.  使用 `@tool` 装饰器创建一个检索器工具：
```python
from langchain.tools import tool

@tool
def retrieve_blog_posts(query: str) -> str:
    """搜索并返回关于 Lilian Weng 博客文章的信息。"""
    docs = retriever.invoke(query)
    return "\n\n".join([doc.page_content for doc in docs])

retriever_tool = retrieve_blog_posts
```
3.  测试工具：
```python
retriever_tool.invoke({"query": "types of reward hacking"})
```

## 3. 生成查询

现在我们将开始为我们的智能 RAG 图构建组件（[节点](/oss/python/langgraph/graph-api#nodes) 和 [边](/oss/python/langgraph/graph-api#edges)）。

请注意，组件将在 [`MessagesState`](/oss/python/langgraph/graph-api#messagesstate) 上运行——这是一种图状态，包含一个带有[聊天消息](https://python.langchain.com/docs/concepts/messages/)列表的 `messages` 键。

1.  构建 `generate_query_or_respond` 节点。它将调用一个 LLM，根据当前的图状态（消息列表）生成响应。根据输入消息，它将决定是使用检索器工具进行检索，还是直接响应用户。注意，我们通过 `.bind_tools` 让聊天模型能够访问我们之前创建的 `retriever_tool`：
```python
from langgraph.graph import MessagesState
from langchain.chat_models import init_chat_model

response_model = init_chat_model("gpt-4o", temperature=0)

def generate_query_or_respond(state: MessagesState):
    """调用模型根据当前状态生成响应。根据问题，它将决定是使用检索器工具进行检索，还是直接响应用户。"""
    response = (
        response_model
        .bind_tools([retriever_tool]).invoke(state["messages"])  # [!code highlight]
    )
    return {"messages": [response]}
```
2.  在一个随机输入上尝试：
```python
input = {"messages": [{"role": "user", "content": "hello!"}]}
generate_query_or_respond(input)["messages"][-1].pretty_print()
```
  **输出：**
```
================================== Ai Message ==================================

Hello! How can I help you today?
```
3.  询问一个需要语义搜索的问题：
```python
input = {
    "messages": [
        {
            "role": "user",
            "content": "What does Lilian Weng say about types of reward hacking?",
        }
    ]
}
generate_query_or_respond(input)["messages"][-1].pretty_print()
```
  **输出：**
```
================================== Ai Message ==================================
Tool Calls:
retrieve_blog_posts (call_tYQxgfIlnQUDMdtAhdbXNwIM)
Call ID: call_tYQxgfIlnQUDMdtAhdbXNwIM
Args:
    query: types of reward hacking
```

## 4. 评估文档

1.  添加一个[条件边](/oss/python/langgraph/graph-api#conditional-edges)——`grade_documents`——用于确定检索到的文档是否与问题相关。我们将使用一个具有结构化输出模式 `GradeDocuments` 的模型进行文档评估。`grade_documents` 函数将根据评估决策（`generate_answer` 或 `rewrite_question`）返回要前往的节点名称：
```python
from pydantic import BaseModel, Field
from typing import Literal

GRADE_PROMPT = (
    "You are a grader assessing relevance of a retrieved document to a user question. \n "
    "Here is the retrieved document: \n\n {context} \n\n"
    "Here is the user question: {question} \n"
    "If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. \n"
    "Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question."
)

class GradeDocuments(BaseModel):  # [!code highlight]
    """使用二元评分评估文档相关性。"""

    binary_score: str = Field(
        description="相关性评分：如果相关则为 'yes'，否则为 'no'"
    )

grader_model = init_chat_model("gpt-4o", temperature=0)

def grade_documents(
    state: MessagesState,
) -> Literal["generate_answer", "rewrite_question"]:
    """确定检索到的文档是否与问题相关。"""
    question = state["messages"][0].content
    context = state["messages"][-1].content

    prompt = GRADE_PROMPT.format(question=question, context=context)
    response = (
        grader_model
        .with_structured_output(GradeDocuments).invoke(  # [!code highlight]
            [{"role": "user", "content": prompt}]
        )
    )
    score = response.binary_score

    if score == "yes":
        return "generate_answer"
    else:
        return "rewrite_question"
```
2.  在工具响应包含不相关文档的情况下运行此函数：
```python
from langchain_core.messages import convert_to_messages

input = {
    "messages": convert_to_messages(
        [
            {
                "role": "user",
                "content": "What does Lilian Weng say about types of reward hacking?",
            },
            {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    {
                        "id": "1",
                        "name": "retrieve_blog_posts",
                        "args": {"query": "types of reward hacking"},
                    }
                ],
            },
            {"role": "tool", "content": "meow", "tool_call_id": "1"},
        ]
    )
}
grade_documents(input)
```
3.  确认相关文档被正确分类：
```python
input = {
    "messages": convert_to_messages(
        [
            {
                "role": "user",
                "content": "What does Lilian Weng say about types of reward hacking?",
            },
            {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    {
                        "id": "1",
                        "name": "retrieve_blog_posts",
                        "args": {"query": "types of reward hacking"},
                    }
                ],
            },
            {
                "role": "tool",
                "content": "reward hacking can be categorized into two types: environment or goal misspecification, and reward tampering",
                "tool_call_id": "1",
            },
        ]
    )
}
grade_documents(input)
```

:::js
1.  添加一个节点——`gradeDocuments`——用于确定检索到的文档是否与问题相关。我们将使用一个带有 Zod 结构化输出的模型进行文档评估。我们还将添加一个[条件边](/oss/python/langgraph/graph-api#conditional-edges)——`checkRelevance`——它检查评估结果并返回要前往的节点名称（`generate` 或 `rewrite`）：
```typescript
import * as z from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage } from "@langchain/core/messages";

const prompt = ChatPromptTemplate.fromTemplate(
  `You are a grader assessing relevance of retrieved docs to a user question.
  Here are the retrieved docs:
  \n ------- \n
  {context}
  \n ------- \n
  Here is the user question: {question}
  If the content of the docs are relevant to the users question, score them as relevant.
  Give a binary score 'yes' or 'no' score to indicate whether the docs are relevant to the question.
  Yes: The docs are relevant to the question.
  No: The docs are not relevant to the question.`,
);

const gradeDocumentsSchema = z.object({
  binaryScore: z.string().describe("Relevance score 'yes' or 'no'"),  // [!code highlight]
})

async function gradeDocuments(state) {
  const { messages } = state;

  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  }).withStructuredOutput(gradeDocumentsSchema);

  const score = await prompt.pipe(model).invoke({
    question: messages.at(0)?.content,
    context: messages.at(-1)?.content,
  });

  if (score.binaryScore === "yes") {
    return "generate";
  }
  return "rewrite";
}
```
2.  在工具响应包含不相关文档的情况下运行此函数：
```typescript

  const input = {
messages: [
new HumanMessage("What does Lilian Weng say about types of reward hacking?"),
new AIMessage({
tool_calls: [
{
type: "tool_call",
name: "retrieve_blog_posts",
args: { query: "types of reward hacking" },
id: "1",
}
]
}),
new ToolMessage({
content: "meow",
tool_call_id: "1",
})
]
  }
  const result
