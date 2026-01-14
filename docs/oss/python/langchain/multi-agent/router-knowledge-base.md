---
title: 构建一个具备路由功能的多源知识库
sidebarTitle: 'Router: Knowledge base'
---


## 概述

**路由模式**是一种[多智能体](/oss/python/langchain/multi-agent)架构，其中路由步骤对输入进行分类并将其定向到专门的智能体，然后将结果合成为一个组合响应。当您组织的知识存在于不同的**垂直领域**（即各自需要具有专用工具和提示的智能体的独立知识领域）时，这种模式表现出色。

在本教程中，您将构建一个多源知识库路由器，通过一个真实的企业场景来展示这些优势。该系统将协调三个专家：

- 一个**GitHub智能体**，用于搜索代码、议题和拉取请求。
- 一个**Notion智能体**，用于搜索内部文档和维基。
- 一个**Slack智能体**，用于搜索相关线程和讨论。

当用户询问“如何验证API请求？”时，路由器将查询分解为特定于源的子问题，将它们并行路由到相关智能体，并将结果合成为一个连贯的答案。

```mermaid
graph LR
    A([查询]) --> B[分类]
    B --> C[GitHub智能体]
    B --> D[Notion智能体]
    B --> E[Slack智能体]
    C --> F[合成]
    D --> F
    E --> F
    F --> G([组合答案])
```

### 为什么使用路由器？

路由模式提供了几个优势：

- **并行执行**：同时查询多个源，与顺序方法相比减少了延迟。
- **专用智能体**：每个垂直领域都有针对其领域优化的专用工具和提示。
- **选择性路由**：并非每个查询都需要每个源——路由器会智能地选择相关的垂直领域。
- **针对性子问题**：每个智能体收到一个针对其领域定制的问题，提高了结果质量。
- **清晰合成**：来自多个源的结果被组合成一个单一的、连贯的响应。

### 概念

我们将涵盖以下概念：

- [多智能体系统](/oss/python/langchain/multi-agent)
- 用于工作流编排的 [StateGraph](/oss/python/langchain/graphs)
- 用于并行执行的 [Send API](/oss/python/langchain/send)

<Tip>

<strong>路由器 vs. 子智能体</strong>：[子智能体模式](/oss/python/langchain/multi-agent/subagents) 也可以路由到多个智能体。当您需要专门的预处理、自定义路由逻辑或希望显式控制并行执行时，请使用路由模式。当您希望LLM动态决定调用哪些智能体时，请使用子智能体模式。

</Tip>

## 设置

### 安装

本教程需要 `langchain` 和 `langgraph` 包：

::: code-group

```bash [pip]
pip install langchain langgraph
```

```bash [uv]
uv add langchain langgraph
```

```bash [conda]
conda install langchain langgraph -c conda-forge
```

:::

更多详情，请参阅我们的 [安装指南](/oss/python/langchain/install)。

### LangSmith

设置 [LangSmith](https://smith.langchain.com) 以检查您的智能体内部发生的情况。然后设置以下环境变量：

::: code-group

```bash [bash]
export LANGSMITH_TRACING="true"
export LANGSMITH_API_KEY="..."
```

```python [python]
import getpass
import os

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass()
```

:::

### 选择LLM

从LangChain的集成套件中选择一个聊天模型：

<!--@include: @/snippets/python/chat-model-tabs.md-->

## 1. 定义状态

首先，定义状态模式。我们使用三种类型：

- **`AgentInput`**：传递给每个子智能体的简单状态（仅包含查询）
- **`AgentOutput`**：每个子智能体返回的结果（来源名称 + 结果）
- **`RouterState`**：主工作流状态，用于跟踪查询、分类、结果和最终答案

```python
from typing import Annotated, Literal, TypedDict
import operator

class AgentInput(TypedDict):
    """Simple input state for each subagent."""
    query: str

class AgentOutput(TypedDict):
    """Output from each subagent."""
    source: str
    result: str

class Classification(TypedDict):
    """A single routing decision: which agent to call with what query."""
    source: Literal["github", "notion", "slack"]
    query: str

class RouterState(TypedDict):
    query: str
    classifications: list[Classification]
    results: Annotated[list[AgentOutput], operator.add]  # Reducer collects parallel results
    final_answer: str
```

`results` 字段使用一个**归约器**（Python 中是 `operator.add`，JS 中是一个连接函数）来将并行智能体执行的输出收集到一个列表中。

## 2. 为每个垂直领域定义工具

为每个知识领域创建工具。在生产系统中，这些工具会调用实际的 API。在本教程中，我们使用返回模拟数据的存根实现。我们定义了跨 3 个垂直领域的 7 个工具：GitHub（搜索代码、问题、PR）、Notion（搜索文档、获取页面）和 Slack（搜索消息、获取线程）。

```python [expandable]
from langchain.tools import tool

@tool
def search_code(query: str, repo: str = "main") -> str:
    """Search code in GitHub repositories."""
    return f"Found code matching '{query}' in {repo}: authentication middleware in src/auth.py"

@tool
def search_issues(query: str) -> str:
    """Search GitHub issues and pull requests."""
    return f"Found 3 issues matching '{query}': #142 (API auth docs), #89 (OAuth flow), #203 (token refresh)"

@tool
def search_prs(query: str) -> str:
    """Search pull requests for implementation details."""
    return f"PR #156 added JWT authentication, PR #178 updated OAuth scopes"

@tool
def search_notion(query: str) -> str:
    """Search Notion workspace for documentation."""
    return f"Found documentation: 'API Authentication Guide' - covers OAuth2 flow, API keys, and JWT tokens"

@tool
def get_page(page_id: str) -> str:
    """Get a specific Notion page by ID."""
    return f"Page content: Step-by-step authentication setup instructions"

@tool
def search_slack(query: str) -> str:
    """Search Slack messages and threads."""
    return f"Found discussion in #engineering: 'Use Bearer tokens for API auth, see docs for refresh flow'"

@tool
def get_thread(thread_id: str) -> str:
    """Get a specific Slack thread."""
    return f"Thread discusses best practices for API key rotation"
```

## 3. 创建专用智能体

为每个垂直领域创建一个智能体。每个智能体都拥有特定领域的工具和针对其知识源优化的提示。三者遵循相同的模式——仅工具和系统提示不同。

```python [expandable]
from langchain.agents import create_agent
from langchain.chat_models import init_chat_model

model = init_chat_model("openai:gpt-4o")

github_agent = create_agent(
    model,
    tools=[search_code, search_issues, search_prs],
    system_prompt=(
        "You are a GitHub expert. Answer questions about code, "
        "API references, and implementation details by searching "
        "repositories, issues, and pull requests."
    ),
)

notion_agent = create_agent(
    model,
    tools=[search_notion, get_page],
    system_prompt=(
        "You are a Notion expert. Answer questions about internal "
        "processes, policies, and team documentation by searching "
        "the organization's Notion workspace."
    ),
)

slack_agent = create_agent(
    model,
    tools=[search_slack, get_thread],
    system_prompt=(
        "You are a Slack expert. Answer questions by searching "
        "relevant threads and discussions where team members have "
        "shared knowledge and solutions."
    ),
)
```

## 4. 构建路由工作流

现在使用 StateGraph 构建路由工作流。该工作流包含四个主要步骤：

1.  **分类**：分析查询，确定调用哪些智能体以及使用什么子问题
2.  **路由**：使用 `Send` 并行分发到选定的智能体
3.  **查询智能体**：每个智能体接收一个简单的 `AgentInput` 并返回一个 `AgentOutput`
4.  **综合**：将收集到的结果组合成一个连贯的响应

```python
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send

router_llm = init_chat_model("openai:gpt-4o-mini")

# 为分类器定义结构化输出模式
class ClassificationResult(BaseModel):  # [!code highlight]
    """将用户查询分类为智能体特定子问题的结果。"""
    classifications: list[Classification] = Field(
        description="要调用的智能体列表及其针对性的子问题"
    )

def classify_query(state: RouterState) -> dict:
    """对查询进行分类并确定要调用哪些智能体。"""
    structured_llm = router_llm.with_structured_output(ClassificationResult)  # [!code highlight]

    result = structured_llm.invoke([
        {
            "role": "system",
            "content": """分析此查询并确定需要咨询哪些知识库。
为每个相关来源生成一个针对该来源优化的针对性子问题。

可用来源：
- github: 代码、API 参考、实现细节、问题、拉取请求
- notion: 内部文档、流程、策略、团队维基
- slack: 团队讨论、非正式知识分享、近期对话

仅返回与查询相关的来源。每个来源都应有一个针对该特定知识领域优化的针对性子问题。

例如，对于“如何进行 API 请求身份验证？”：
- github: “存在哪些身份验证代码？搜索身份验证中间件、JWT 处理”
- notion: “存在哪些身份验证文档？查找 API 身份验证指南”
（省略 slack，因为此技术问题不相关）"""
        },
        {"role": "user", "content": state["query"]}
    ])

    return {"classifications": result.classifications}

def route_to_agents(state: RouterState) -> list[Send]:
    """根据分类结果分发到智能体。"""
    return [
        Send(c["source"], {"query": c["query"]})  # [!code highlight]
        for c in state["classifications"]
    ]

def query_github(state: AgentInput) -> dict:
    """查询 GitHub 智能体。"""
    result = github_agent.invoke({
        "messages": [{"role": "user", "content": state["query"]}]  # [!code highlight]
    })
    return {"results": [{"source": "github", "result": result["messages"][-1].content}]}

def query_notion(state: AgentInput) -> dict:
    """查询 Notion 智能体。"""
    result = notion_agent.invoke({
        "messages": [{"role": "user", "content": state["query"]}]  # [!code highlight]
    })
    return {"results": [{"source": "notion", "result": result["messages"][-1].content}]}

def query_slack(state: AgentInput) -> dict:
    """查询 Slack 智能体。"""
    result = slack_agent.invoke({
        "messages": [{"role": "user", "content": state["query"]}]  # [!code highlight]
    })
    return {"results": [{"source": "slack", "result": result["messages"][-1].content}]}

def synthesize_results(state: RouterState) -> dict:
    """将所有智能体的结果组合成一个连贯的答案。"""
    if not state["results"]:
        return {"final_answer": "未从任何知识源找到结果。"}

# 格式化结果以进行综合
formatted = [
    f"**来自 {r['source'].title()}:**\n{r['result']}"
    for r in state["results"]
]

synthesis_response = router_llm.invoke([
    {
        "role": "system",
        "content": f"""综合这些搜索结果以回答原始问题："{state['query']}"

- 合并来自多个来源的信息，避免冗余
- 突出显示最相关和可操作的信息
- 注意来源之间的任何差异
- 保持回答简洁且组织良好"""
    },
    {"role": "user", "content": "\n\n".join(formatted)}
])

return {"final_answer": synthesis_response.content}
```

## 5. 编译工作流

现在通过用边连接节点来组装工作流。关键是使用 `add_conditional_edges` 和路由函数来实现并行执行：

```python
workflow = (
    StateGraph(RouterState)
    .add_node("classify", classify_query)
    .add_node("github", query_github)
    .add_node("notion", query_notion)
    .add_node("slack", query_slack)
    .add_node("synthesize", synthesize_results)
    .add_edge(START, "classify")
    .add_conditional_edges("classify", route_to_agents, ["github", "notion", "slack"])
    .add_edge("github", "synthesize")
    .add_edge("notion", "synthesize")
    .add_edge("slack", "synthesize")
    .add_edge("synthesize", END)
    .compile()
)
```

`add_conditional_edges` 调用通过 `route_to_agents` 函数将分类节点连接到代理节点。当 `route_to_agents` 返回多个 `Send` 对象时，这些节点会并行执行。

## 6. 使用路由器

使用跨越多个知识领域的查询来测试你的路由器：

```python
result = workflow.invoke({
    "query": "How do I authenticate API requests?"
})

print("Original query:", result["query"])
print("\nClassifications:")
for c in result["classifications"]:
    print(f"  {c['source']}: {c['query']}")
print("\n" + "=" * 60 + "\n")
print("Final Answer:")
print(result["final_answer"])
```

预期输出：
```
Original query: How do I authenticate API requests?

Classifications:
  github: What authentication code exists? Search for auth middleware, JWT handling
  notion: What authentication documentation exists? Look for API auth guides

============================================================

Final Answer:
To authenticate API requests, you have several options:

1. **JWT Tokens**: The recommended approach for most use cases.
   Implementation details are in `src/auth.py` (PR #156).

2. **OAuth2 Flow**: For third-party integrations, follow the OAuth2
   flow documented in Notion's 'API Authentication Guide'.

3. **API Keys**: For server-to-server communication, use Bearer tokens
   in the Authorization header.

For token refresh handling, see issue #203 and PR #178 for the latest
OAuth scope updates.
```

路由器分析了查询，对其分类以确定要调用哪些代理（对于这个技术问题，调用了 GitHub 和 Notion，但没有调用 Slack），并行查询了两个代理，并将结果综合成一个连贯的答案。

## 7. 理解架构

路由器工作流遵循一个清晰的模式：

### 分类阶段

`classify_query` 函数使用**结构化输出**来分析用户的查询并确定要调用哪些代理。这就是路由智能所在的地方：

- 使用 Pydantic 模型（Python）或 Zod 模式（JS）来确保输出有效
- 返回一个 `Classification` 对象列表，每个对象包含一个 `source` 和针对性的 `query`
- 仅包含相关来源——不相关的来源会被直接省略

这种结构化方法比自由格式的 JSON 解析更可靠，并使路由逻辑变得明确。

### 使用 send 进行并行执行

`route_to_agents` 函数将分类映射到 `Send` 对象。每个 `Send` 指定目标节点和要传递的状态：

```python
# 分类: [{"source": "github", "query": "..."}, {"source": "notion", "query": "..."}]
# 变为:
[Send("github", {"query": "..."}), Send("notion", {"query": "..."})]
# 两个智能体同时执行，每个只接收它需要的查询
```

每个智能体节点接收一个简单的 `AgentInput`，只包含一个 `query` 字段——而不是完整的路由器状态。这保持了接口的简洁和明确。

### 使用归约器收集结果

智能体的结果通过**归约器**流回主状态。每个智能体返回：

```python
{"results": [{"source": "github", "result": "..."}]}
```

归约器（Python 中的 `operator.add`）连接这些列表，将所有并行结果收集到 `state["results"]` 中。

### 合成阶段

在所有智能体完成后，`synthesize_results` 函数遍历收集到的结果：

- 等待所有并行分支完成（LangGraph 会自动处理）
- 引用原始查询以确保答案回应用户所问
- 合并所有来源的信息，避免冗余

<Note>

<strong>部分结果</strong>：在本教程中，所有选定的智能体必须在合成之前完成。对于更高级的模式，例如希望处理部分结果或超时的情况，请参阅 [map-reduce 指南](/oss/python/langchain/map-reduce)。

</Note>

## 8. 完整的工作示例

以下是一个可运行脚本中的完整代码：

<Expandable title="查看完整代码" :defaultOpen="false">

```python
"""
多源知识路由器示例

此示例演示了多智能体系统的路由器模式。
一个路由器对查询进行分类，将它们并行路由到专门的智能体，
并将结果合成为一个组合响应。
"""

import operator
from typing import Annotated, Literal, TypedDict

from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langchain.tools import tool
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from pydantic import BaseModel, Field

# 状态定义
class AgentInput(TypedDict):
    """每个子智能体的简单输入状态。"""
    query: str

class AgentOutput(TypedDict):
    """每个子智能体的输出。"""
    source: str
    result: str

class Classification(TypedDict):
    """单个路由决策：调用哪个智能体以及使用什么查询。"""
    source: Literal["github", "notion", "slack"]
    query: str

class RouterState(TypedDict):
    query: str
    classifications: list[Classification]
    results: Annotated[list[AgentOutput], operator.add]
    final_answer: str

# 分类器的结构化输出模式
class ClassificationResult(BaseModel):
    """将用户查询分类为智能体特定子问题的结果。"""
    classifications: list[Classification] = Field(
        description="要调用的智能体列表及其针对性的子问题"
    )
```

# 工具
@tool
def search_code(query: str, repo: str = "main") -> str:
"""在 GitHub 仓库中搜索代码。"""
return f"在 {repo} 中找到匹配 '{query}' 的代码：src/auth.py 中的身份验证中间件"

@tool
def search_issues(query: str) -> str:
"""搜索 GitHub 议题和拉取请求。"""
return f"找到 3 个匹配 '{query}' 的议题：#142 (API 身份验证文档), #89 (OAuth 流程), #203 (令牌刷新)"

@tool
def search_prs(query: str) -> str:
"""搜索拉取请求以获取实现细节。"""
return f"PR #156 添加了 JWT 身份验证，PR #178 更新了 OAuth 作用域"

@tool
def search_notion(query: str) -> str:
"""在 Notion 工作区中搜索文档。"""
return f"找到文档：'API 身份验证指南' - 涵盖 OAuth2 流程、API 密钥和 JWT 令牌"

@tool
def get_page(page_id: str) -> str:
"""通过 ID 获取特定的 Notion 页面。"""
return f"页面内容：分步身份验证设置说明"

@tool
def search_slack(query: str) -> str:
"""搜索 Slack 消息和线程。"""
return f"在 #engineering 频道中找到讨论：'API 身份验证使用 Bearer 令牌，刷新流程请参阅文档'"

@tool
def get_thread(thread_id: str) -> str:
"""获取特定的 Slack 线程。"""
return f"线程讨论了 API 密钥轮换的最佳实践"

# 模型和智能体
model = init_chat_model("openai:gpt-4o")
router_llm = init_chat_model("openai:gpt-4o-mini")

github_agent = create_agent(
model,
tools=[search_code, search_issues, search_prs],
system_prompt=(
"你是一名 GitHub 专家。通过搜索仓库、议题和拉取请求来回答有关代码、"
"API 参考和实现细节的问题。"
),
)

notion_agent = create_agent(
model,
tools=[search_notion, get_page],
system_prompt=(
"你是一名 Notion 专家。通过搜索组织的 Notion 工作区来回答有关内部"
"流程、政策和团队文档的问题。"
),
)

slack_agent = create_agent(
model,
tools=[search_slack, get_thread],
system_prompt=(
"你是一名 Slack 专家。通过搜索团队成员分享知识和解决方案的相关线程"
"和讨论来回答问题。"
),
)

# 工作流节点
def classify_query(state: RouterState) -> dict:
"""对查询进行分类并确定要调用哪些智能体。"""
structured_llm = router_llm.with_structured_output(ClassificationResult)

result = structured_llm.invoke([
{
"role": "system",
"content": """分析此查询并确定需要咨询哪些知识库。
为每个相关来源生成一个针对该来源优化的目标子查询。

可用来源：
- github: 代码、API 参考、实现细节、议题、拉取请求
- notion: 内部文档、流程、政策、团队维基
- slack: 团队讨论、非正式知识分享、近期对话

仅返回与查询相关的来源。"""
},
{"role": "user", "content": state["query"]}
])

return {"classifications": result.classifications}

def route_to_agents(state: RouterState) -> list[Send]:
"""根据分类结果将查询分发到相应的智能体。"""
return [
Send(c["source"], {"query": c["query"]})
for c in state["classifications"]
]

def query_github(state: AgentInput) -> dict:
"""查询 GitHub 智能体。"""
result = github_agent.invoke({
"messages": [{"role": "user", "content": state["query"]}]
})
return {"results": [{"source": "github", "result": result["messages"][-1].content}]}

def query_notion(state: AgentInput) -> dict:
"""查询 Notion 智能体。"""
result = notion_agent.invoke({
"messages": [{"role": "user", "content": state["query"]}]
})
return {"results": [{"source": "notion", "result": result["messages"][-1].content}]}

def query_slack(state: AgentInput) -> dict:
"""查询 Slack 智能体。"""
result = slack_agent.invoke({
"messages": [{"role": "user", "content": state["query"]}]
})
return {"results": [{"source": "slack", "result": result["messages"][-1].content}]}

def synthesize_results(state: RouterState) -> dict:
"""将所有智能体的结果合并成一个连贯的答案。"""
if not state["results"]:
return {"final_answer": "未从任何知识源找到结果。"}

formatted = [
f"**来自 {r['source'].title()}：**\n{r['result']}"
for r in state["results"]
]

synthesis_response = router_llm.invoke([
{
"role": "system",
"content": f"""综合这些搜索结果来回答原始问题："{state['query']}"

- 合并来自多个来源的信息，避免冗余
- 突出显示最相关和可操作的信息
- 注意来源之间的任何差异
- 保持回答简洁且组织良好"""
},
{"role": "user", "content": "\n\n".join(formatted)}
])

return {"final_answer": synthesis_response.content}

# 构建工作流
workflow = (
StateGraph(RouterState)
.add_node("classify", classify_query)
.add_node("github", query_github)
.add_node("notion", query_notion)
.add_node("slack", query_slack)
.add_node("synthesize", synthesize_results)
.add_edge(START, "classify")
.add_conditional_edges("classify", route_to_agents, ["github", "notion", "slack"])
.add_edge("github", "synthesize")
.add_edge("notion", "synthesize")
.add_edge("slack", "synthesize")
.add_edge("synthesize", END)
.compile()
)

if __name__ == "__main__":
result = workflow.invoke({
"query": "How do I authenticate API requests?"
})

print("Original query:", result["query"])
print("\nClassifications:")
for c in result["classifications"]:
print(f"  {c['source']}: {c['query']}")
print("\n" + "=" * 60 + "\n")
print("Final Answer:")
print(result["final_answer"])
```
:::

:::js

```typescript
/**
 * 多源知识路由示例
 *
 * 此示例演示了多智能体系统的路由模式。
 * 路由器对查询进行分类，将它们并行路由到专门的智能体，并将结果综合成一个组合响应。
 */

const AgentOutput = z.object({
  source: z.string(),
  result: z.string(),
});

const RouterState = z.object({
  query: z.string(),
  classifications: z.array(
z.object({
source: z.enum(["github", "notion", "slack"]),
query: z.string(),
})
  ),
  results: z
.array(AgentOutput)
.default([])
.meta({
reducer: (current: z.infer<typeof AgentOutput>[], update: z.infer<typeof AgentOutput>[]) =>
current.concat(update),
}),
  finalAnswer: z.string(),
});

const searchCode = tool(
  async ({ query, repo }) => {
return `Found code matching '${query}' in ${repo || "main"}: authentication middleware in src/auth.py`;
  },
  {
name: "search_code",
description: "在 GitHub 仓库中搜索代码。",
schema: z.object({
query: z.string(),
repo: z.string().optional().default("main"),
}),
  }
);

const searchIssues = tool(
  async ({ query }) => {
return `Found 3 issues matching '${query}': #142 (API auth docs), #89 (OAuth flow), #203 (token refresh)`;
  },
  {
name: "search_issues",
description: "搜索 GitHub 问题和拉取请求。",
schema: z.object({
query: z.string(),
}),
  }
);

const searchPrs = tool(
  async ({ query }) => {
return `PR #156 added JWT authentication, PR #178 updated OAuth scopes`;
  },
  {
name: "search_prs",
description: "搜索拉取请求以获取实现细节。",
schema: z.object({
query: z.string(),
}),
  }
);

const searchNotion = tool(
  async ({ query }) => {
return `找到文档：'API 认证指南' - 涵盖 OAuth2 流程、API 密钥和 JWT 令牌`;
  },
  {
name: "search_notion",
description: "在 Notion 工作区中搜索文档。",
schema: z.object({
query: z.string(),
}),
  }
);

const getPage = tool(
  async ({ pageId }) => {
return `页面内容：分步认证设置说明`;
  },
  {
name: "get_page",
description: "根据 ID 获取特定的 Notion 页面。",
schema: z.object({
pageId: z.string(),
}),
  }
);

const searchSlack = tool(
  async ({ query }) => {
return `在 #engineering 频道中找到讨论：'API 认证使用 Bearer 令牌，刷新流程请参阅文档'`;
  },
  {
name: "search_slack",
description: "搜索 Slack 消息和线程。",
schema: z.object({
query: z.string(),
}),
  }
);

const getThread = tool(
  async ({ threadId }) => {
return `线程讨论了 API 密钥轮换的最佳实践`;
  },
  {
name: "get_thread",
description: "获取特定的 Slack 线程。",
schema: z.object({
threadId: z.string(),
}),
  }
);

const llm = new ChatOpenAI({ model: "gpt-4o" });

const githubAgent = createAgent({
  model: llm,
  tools: [searchCode, searchIssues, searchPrs],
  systemPrompt: `
你是一名 GitHub 专家。通过搜索仓库、议题和拉取请求来回答有关代码、
API 参考和实现细节的问题。
  `.trim(),
});

const notionAgent = createAgent({
  model: llm,
  tools: [searchNotion, getPage],
  systemPrompt: `
你是一名 Notion 专家。通过搜索组织的 Notion 工作区来回答有关内部
流程、政策和团队文档的问题。
  `.trim(),
});

const slackAgent = createAgent({
  model: llm,
  tools: [searchSlack, getThread],
  systemPrompt: `
你是一名 Slack 专家。通过搜索团队成员分享知识和解决方案的
相关线程和讨论来回答问题。
  `.trim(),
});

const routerLlm = new ChatOpenAI({ model: "gpt-4o-mini" });

// 为分类器定义结构化输出模式
const ClassificationResultSchema = z.object({
  // [!code highlight]
  classifications: z
.array(
z.object({
source: z.enum(["github", "notion", "slack"]),
query: z.string(),
})
)
.describe("要调用的智能体列表及其目标子问题"),
});

async function classifyQuery(state: z.infer<typeof RouterState>) {
  const structuredLlm = routerLlm.withStructuredOutput(
ClassificationResultSchema
  ); // [!code highlight]

  const result = await structuredLlm.invoke([
{
role: "system",
content: `分析此查询并确定要咨询哪些知识库。
为每个相关来源生成一个针对该来源优化的目标子问题。

可用来源：
- github: 代码、API 参考、实现细节、议题、拉取请求
- notion: 内部文档、流程、政策、团队维基
- slack: 团队讨论、非正式知识分享、近期对话

仅返回与查询相关的来源。每个来源都应有一个针对该特定知识领域优化的目标子问题。

例如，对于"如何认证 API 请求？"：
- github: "存在哪些认证代码？搜索认证中间件、JWT 处理"
- notion: "存在哪些认证文档？查找 API 认证指南"
（省略 slack，因为此技术问题不相关）`,
},
{ role: "user", content: state.query },
  ]);

  return { classifications: result.classifications };
}

function routeToAgents(state: z.infer<typeof RouterState>): Send[] {
  return state.classifications.map(
(c) => new Send(c.source, { query: c.query }) // [!code highlight]
  );
}

async function queryGithub(state: z.infer<typeof RouterState>) {
  const result = await githubAgent.invoke({
messages: [{ role: "user", content: state.query }], // [!code highlight]
  });
  return {
results: [{ source: "github", result: result.messages.at(-1)?.content }],
  };
}

async function queryNotion(state: z.infer<typeof RouterState>) {
  const result = await notionAgent.invoke({
messages: [{ role: "user", content: state.query }], // [!code highlight]
  });
  return {
results: [{ source: "notion", result: result.messages.at(-1)?.content }],
  };
}

async function querySlack(state: z.infer<typeof RouterState>) {
  const result = await slackAgent.invoke({
messages: [{ role: "user", content: state.query }], // [!code highlight]
  });
  return {
results: [{ source: "slack", result: result.messages.at(-1)?.content }],
  };
}

async function synthesizeResults(state: z.infer<typeof RouterState>) {
  if (state.results.length === 0) {
return { finalAnswer: "No results found from any knowledge source." };
  }

  // 格式化结果以便综合
  const formatted = state.results.map(
(r) =>
`**From ${r.source.charAt(0).toUpperCase() + r.source.slice(1)}:**\n${r.result}`
  );

  const synthesisResponse = await routerLlm.invoke([
{
role: "system",
content: `Synthesize these search results to answer the original question: "${state.query}"

- Combine information from multiple sources without redundancy
- Highlight the most relevant and actionable information
- Note any discrepancies between sources
- Keep the response concise and well-organized`,
},
{ role: "user", content: formatted.join("\n\n") },
  ]);

  return { finalAnswer: synthesisResponse.content };
}

const workflow = new StateGraph(RouterState)
  .addNode("classify", classifyQuery)
  .addNode("github", queryGithub)
  .addNode("notion", queryNotion)
  .addNode("slack", querySlack)
  .addNode("synthesize", synthesizeResults)
  .addEdge(START, "classify")
  .addConditionalEdges("classify", routeToAgents, ["github", "notion", "slack"])
  .addEdge("github", "synthesize")
  .addEdge("notion", "synthesize")
  .addEdge("slack", "synthesize")
  .addEdge("synthesize", END)
  .compile();

const result = await workflow.invoke({
  query: "How do I authenticate API requests?",
});

console.log("Original query:", result.query);
console.log("\nClassifications:");
for (const c of result.classifications) {
  console.log(`  ${c.source}: ${c.query}`);
}
console.log(`\n${"=".repeat(60)}\n`);
console.log("Final Answer:");
console.log(result.finalAnswer);
```
:::

</Expandable>

## 9. 高级：有状态的路由器

我们目前构建的路由器是**无状态**的——每个请求都是独立处理的，调用之间没有记忆。对于多轮对话，你需要一种**有状态**的方法。

### 工具包装器方法

添加对话记忆最简单的方法是将无状态路由器包装成一个对话智能体可以调用的工具：

:::python

```python
from langgraph.checkpoint.memory import InMemorySaver

@tool
def search_knowledge_base(query: str) -> str:
"""Search across multiple knowledge sources (GitHub, Notion, Slack).

Use this to find information about code, documentation, or team discussions.
"""
result = workflow.invoke({"query": query})
return result["final_answer"]

conversational_agent = create_agent(
model,
tools=[search_knowledge_base],
system_prompt=(
"You are a helpful assistant that answers questions about our organization. "
"Use the search_knowledge_base tool to find information across our code, "
"documentation, and team discussions."
),
checkpointer=InMemorySaver(),
)
```
:::

:::js

```typescript

const searchKnowledgeBase = tool(
  async ({ query }) => {
const result = await workflow.invoke({ query });
return result.finalAnswer;
  },
  {
name: "search_knowledge_base",
description: `跨多个知识源（GitHub、Notion、Slack）进行搜索。
使用此工具查找有关代码、文档或团队讨论的信息。`,
schema: z.object({
query: z.string().describe("搜索查询"),
}),
  }
);

const conversationalAgent = createAgent({
  model: llm,
  tools: [searchKnowledgeBase],
  systemPrompt: `
您是一个乐于助人的助手，负责回答有关我们组织的问题。
使用 search_knowledge_base 工具在我们的代码、文档和团队讨论中查找信息。
  `.trim(),
  checkpointer: new MemorySaver(),
});
```
:::

这种方法使路由器保持无状态，而对话智能体则处理记忆和上下文。用户可以进行多轮对话，智能体将根据需要调用路由器工具。

:::python

```python
config = {"configurable": {"thread_id": "user-123"}}

result = conversational_agent.invoke(
{"messages": [{"role": "user", "content": "How do I authenticate API requests?"}]},
config
)
print(result["messages"][-1].content)

result = conversational_agent.invoke(
{"messages": [{"role": "user", "content": "What about rate limiting for those endpoints?"}]},
config
)
print(result["messages"][-1].content)
```
:::

:::js

```typescript
const config = { configurable: { thread_id: "user-123" } };
let conversationalAgentResult = await conversationalAgent.invoke(
  {
messages: [
{ role: "user", content: "How do I authenticate API requests?" },
],
  },
  config
);
console.log(conversationalAgentResult.messages.at(-1)?.content);

conversationalAgentResult = await conversationalAgent.invoke(
  {
messages: [
{
role: "user",
content: "What about rate limiting for those endpoints?",
},
],
  },
  config
);
console.log(conversationalAgentResult.messages.at(-1)?.content);
```

<Tip>

对于大多数用例，推荐使用工具包装器方法。它提供了清晰的分离：路由器处理多源查询，而对话智能体处理上下文和记忆。

</Tip>

### 完全持久化方法

如果您需要路由器本身维护状态——例如，在路由决策中使用先前的搜索结果——请使用[持久化](/oss/python/langchain/short-term-memory)在路由器级别存储消息历史记录。

<Warning>

<strong>有状态路由器会增加复杂性。</strong> 当在不同轮次中路由到不同的智能体时，如果智能体具有不同的语气或提示，对话可能会感觉不一致。请考虑使用[交接模式](/oss/python/langchain/multi-agent/handoffs)或[子智能体模式](/oss/python/langchain/multi-agent/subagents)——这两种模式都为与不同智能体的多轮对话提供了更清晰的语义。

</Warning>

## 10. 关键要点

路由器模式在以下情况下表现出色：

- **不同的垂直领域**：每个都需要专门工具和提示的独立知识领域
- **并行查询需求**：受益于同时查询多个来源的问题
- **综合需求**：需要将来自多个来源的结果组合成连贯的响应

该模式包含三个阶段：**分解**（分析查询并生成有针对性的子问题）、**路由**（并行执行查询）和**综合**（组合结果）。

<Tip>

<strong>何时使用路由器模式</strong>

当您拥有多个独立的知识源、需要低延迟的并行查询，并且希望对路由逻辑进行显式控制时，请使用路由器模式。

对于具有动态工具选择的更简单情况，请考虑[子智能体模式](/oss/python/langchain/multi-agent/subagents)。对于需要智能体与用户顺序对话的工作流，请考虑[交接模式](/oss/python/langchain/multi-agent/handoffs)。

</Tip>

## 后续步骤

- 了解[交接](/oss/python/langchain/multi-agent/handoffs)机制，用于智能体（agent）间的对话
- 探索[子智能体模式](/oss/python/langchain/multi-agent/subagents-personal-assistant)，实现集中式编排
- 阅读[多智能体概述](/oss/python/langchain/multi-agent)，比较不同模式
- 使用[LangSmith](https://smith.langchain.com)来调试和监控你的路由器
