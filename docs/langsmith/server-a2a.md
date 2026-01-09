---
title: Agent Server 中的 A2A 端点
sidebarTitle: A2A endpoint in Agent Server
---
[Agent2Agent (A2A)](https://a2a-protocol.org/latest/) 是 Google 制定的用于实现对话式 AI 智能体间通信的协议。[LangSmith 实现了对 A2A 的支持](https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref.html#tag/a2a/post/a2a/{assistant_id})，允许您的智能体通过标准化协议与其他兼容 A2A 的智能体进行通信。

A2A 端点可在 [Agent Server](/langsmith/agent-server) 的 `/a2a/{assistant_id}` 路径下使用。

## 支持的方法

Agent Server 支持以下 A2A RPC 方法：

- **message/send**：向助手发送消息并接收完整响应
- **message/stream**：发送消息并使用服务器发送事件 (SSE) 实时流式传输响应
- **tasks/get**：检索先前创建任务的状态和结果

## 智能体卡片发现

每个助手会自动公开一个 A2A 智能体卡片，该卡片描述了其能力，并提供了其他智能体连接所需的信息。您可以使用以下方式检索任何助手的智能体卡片：

```
GET /.well-known/agent-card.json?assistant_id={assistant_id}
```

智能体卡片包含助手的名称、描述、可用技能、支持的输入/输出模式以及用于通信的 A2A 端点 URL。

## 要求

要使用 A2A，请确保已安装以下依赖项：

* `langgraph-api >= 0.4.21`

使用以下命令安装：

```bash
pip install "langgraph-api>=0.4.21"
```

## 使用概述

要启用 A2A：

* 升级到使用 langgraph-api>=0.4.21。
* 部署使用基于消息的状态结构的智能体。
* 使用端点与其他兼容 A2A 的智能体连接。

## 创建兼容 A2A 的智能体

此示例创建一个兼容 A2A 的智能体，该智能体使用 OpenAI 的 API 处理传入消息并维护对话状态。该智能体定义了基于消息的状态结构，并处理 A2A 协议的消息格式。

为了兼容 [A2A "text" 部分](https://a2a-protocol.org/dev/specification/#651-textpart-object)，智能体的状态中必须有一个 `messages` 键。示例如下：

```python
"""LangGraph A2A 对话智能体。

支持 A2A 协议，用于对话交互的消息输入。
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Dict, List, TypedDict

from langgraph.graph import StateGraph
from langgraph.runtime import Runtime
from openai import AsyncOpenAI

class Context(TypedDict):
    """智能体的上下文参数。"""
    my_configurable_param: str

@dataclass
class State:
    """智能体的输入状态。

    为 A2A 对话消息定义初始结构。
    """
    messages: List[Dict[str, Any]]

async def call_model(state: State, runtime: Runtime[Context]) -> Dict[str, Any]:
    """处理对话消息并使用 OpenAI 返回输出。"""
    # 初始化 OpenAI 客户端
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # 处理传入消息
    latest_message = state.messages[-1] if state.messages else {}
    user_content = latest_message.get("content", "No message content")

    # 为 OpenAI API 创建消息
    openai_messages = [
        {
            "role": "system",
            "content": "You are a helpful conversational agent. Keep responses brief and engaging."
        },
        {
            "role": "user",
            "content": user_content
        }
    ]

    try:
        # 调用 OpenAI API
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=openai_messages,
            max_tokens=100,
            temperature=0.7
        )

        ai_response = response.choices[0].message.content

    except Exception as e:
        ai_response = f"I received your message but had trouble processing it. Error: {str(e)[:50]}..."

    # 创建响应消息
    response_message = {
        "role": "assistant",
        "content": ai_response
    }

    return {
        "messages": state.messages + [response_message]
    }

# 定义图
graph = (
    StateGraph(State, context_schema=Context)
    .add_node(call_model)
    .add_edge("__start__", "call_model")
    .compile()
)
```

## 智能体间通信

一旦您的智能体通过 `langgraph dev` 在本地运行或[部署到生产环境](/langsmith/deployments)，您就可以使用 A2A 协议促进它们之间的通信。

此示例演示了两个智能体如何通过向彼此的 A2A 端点发送 JSON-RPC 消息进行通信。该脚本模拟了一个多轮对话，其中每个智能体处理对方的响应并继续对话。

```python
#!/usr/bin/env python3
"""使用 LangGraph A2A 协议的智能体间对话模拟。"""

import asyncio
import aiohttp
import os

async def send_message(session, port, assistant_id, text):
    """向智能体发送消息并返回响应文本。"""
    url = f"http://127.0.0.1:{port}/a2a/{assistant_id}"
    payload = {
        "jsonrpc": "2.0",
        "id": "",
        "method": "message/send",
        "params": {
            "message": {
                "role": "user",
                "parts": [{"kind": "text", "text": text}]
            },
            "messageId": "",
            "thread": {"threadId": ""}
        }
    }

    headers = {"Accept": "application/json"}
    async with session.post(url, json=payload, headers=headers) as response:
        try:
            result = await response.json()
            return result["result"]["artifacts"][0]["parts"][0]["text"]
        except Exception as e:
            text = await response.text()
            print(f"Response error from port {port}: {response.status} - {text}")
            return f"Error from port {port}: {response.status}"

async def simulate_conversation():
    """模拟两个智能体之间的对话。"""
    agent_a_id = os.getenv("AGENT_A_ID")
    agent_b_id = os.getenv("AGENT_B_ID")

    if not agent_a_id or not agent_b_id:
        print("Set AGENT_A_ID and AGENT_B_ID environment variables")
        return

    message = "Hello! Let's have a conversation."

    async with aiohttp.ClientSession() as session:
        for i in range(3):
            print(f"--- Round {i + 1} ---")

            # 智能体 A 响应
            message = await send_message(session, 2024, agent_a_id, message)
            print(f"🔵 Agent A: {message}")

            # 智能体 B 响应
            message = await send_message(session, 2025, agent_b_id, message)
            print(f"🔴 Agent B: {message}")
            print()

if __name__ == "__main__":
    asyncio.run(simulate_conversation())
```

## 禁用 A2A

要禁用 A2A 端点，请在您的 `langgraph.json` 配置文件中将 `disable_a2a` 设置为 `true`：

```json
{
  "$schema": "https://langgra.ph/schema.json",
  "http": {
    "disable_a2a": true
  }
}
```
