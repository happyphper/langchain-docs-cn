---
title: Cohere
---
>[Cohere](https://cohere.ai/about) 是一家加拿大初创公司，提供自然语言处理模型，帮助企业改善人机交互。

## 安装与设置
- 安装 Python SDK：

::: code-group

```bash [pip]
pip install langchain-cohere
```

```bash [uv]
uv add langchain-cohere
```

:::

获取 [Cohere API 密钥](https://dashboard.cohere.ai/) 并将其设置为环境变量 (`COHERE_API_KEY`)

## Cohere LangChain 集成

| API | 描述 | 端点文档 | 导入 | 示例用法 |
|---|---|---|---|---|
| Chat | 构建聊天机器人 | [chat](https://docs.cohere.com/reference/chat) | `from langchain_cohere import ChatCohere` | [cohere.ipynb](/oss/python/integrations/chat/cohere) |
| LLM | 生成文本 | [generate](https://docs.cohere.com/reference/generate) | `from langchain_cohere.llms import Cohere` | [cohere.ipynb](/oss/python/integrations/llms/cohere) |
| RAG Retriever | 连接到外部数据源 | [chat + rag](https://docs.cohere.com/reference/chat) | `from langchain_classic.retrievers import CohereRagRetriever` | [cohere.ipynb](/oss/python/integrations/retrievers/cohere) |
| Text Embedding | 将字符串嵌入为向量 | [embed](https://docs.cohere.com/reference/embed) | `from langchain_cohere import CohereEmbeddings` | [cohere.ipynb](/oss/python/integrations/text_embedding/cohere) |
| Rerank Retriever | 根据相关性对字符串进行排序 | [rerank](https://docs.cohere.com/reference/rerank) | `from langchain_classic.retrievers.document_compressors import CohereRerank` | [cohere.ipynb](/oss/python/integrations/retrievers/cohere-reranker) |

## 快速复制示例

### Chat

```python
from langchain_cohere import ChatCohere
from langchain.messages import HumanMessage
chat = ChatCohere()
messages = [HumanMessage(content="knock knock")]
print(chat.invoke(messages))
```

Cohere [聊天模型](/oss/python/integrations/chat/cohere) 的用法。

### LLM

```python
from langchain_cohere.llms import Cohere

llm = Cohere()
print(llm.invoke("Come up with a pet name"))
```

Cohere（旧版）[LLM 模型](/oss/python/integrations/llms/cohere) 的用法。

### 工具调用

```python
from langchain_cohere import ChatCohere
from langchain.messages import (
    HumanMessage,
    ToolMessage,
)
from langchain.tools import tool

@tool
def magic_function(number: int) -> int:
    """Applies a magic operation to an integer

    Args:
        number: Number to have magic operation performed on
    """
    return number + 10

def invoke_tools(tool_calls, messages):
    for tool_call in tool_calls:
        selected_tool = {"magic_function":magic_function}[
            tool_call["name"].lower()
        ]
        tool_output = selected_tool.invoke(tool_call["args"])
        messages.append(ToolMessage(tool_output, tool_call_id=tool_call["id"]))
    return messages

tools = [magic_function]

llm = ChatCohere()
llm_with_tools = llm.bind_tools(tools=tools)
messages = [
    HumanMessage(
        content="What is the value of magic_function(2)?"
    )
]

res = llm_with_tools.invoke(messages)
while res.tool_calls:
    messages.append(res)
    messages = invoke_tools(res.tool_calls, messages)
    res = llm_with_tools.invoke(messages)

print(res.content)
```
Cohere LLM 的工具调用可以通过将必要的工具绑定到 LLM 来实现，如上所示。
另一种方法是使用下面的 ReAct 代理来支持多跳工具调用。

### ReAct 代理

该代理基于论文
[ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)。

```python
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_cohere import ChatCohere, create_cohere_react_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import AgentExecutor

llm = ChatCohere()

internet_search = TavilySearchResults(max_results=4)
internet_search.name = "internet_search"
internet_search.description = "Route a user query to the internet"

prompt = ChatPromptTemplate.from_template("{input}")

agent = create_cohere_react_agent(
    llm,
    [internet_search],
    prompt
)

agent_executor = AgentExecutor(agent=agent, tools=[internet_search], verbose=True)

agent_executor.invoke({
    "input": "In what year was the company that was founded as Sound of Music added to the S&P 500?",
})
```
ReAct 代理可用于按顺序调用多个工具。

### RAG Retriever

```python
from langchain_cohere import ChatCohere
from langchain_classic.retrievers import CohereRagRetriever
from langchain_core.documents import Document

rag = CohereRagRetriever(llm=ChatCohere())
print(rag.invoke("What is cohere ai?"))
```

Cohere [RAG Retriever](/oss/python/integrations/retrievers/cohere) 的用法。

### Text Embedding

```python
from langchain_cohere import CohereEmbeddings

embeddings = CohereEmbeddings(model="embed-english-light-v3.0")
print(embeddings.embed_documents(["This is a test document."]))
```

Cohere [文本嵌入模型](/oss/python/integrations/text_embedding/cohere) 的用法。

### Reranker

Cohere [Reranker](/oss/python/integrations/retrievers/cohere-reranker) 的用法。
