---
title: 在本地运行 LangGraph 应用
sidebarTitle: Test locally
---
本快速入门指南将展示如何在本地设置 LangGraph 应用程序以进行测试和开发。

## 前提条件

开始之前，请确保您已拥有 [LangSmith](https://smith.langchain.com/settings) 的 API 密钥（可免费注册）。

## 1. 安装 LangGraph CLI

<Tabs>

<Tab title="Python 服务器">

```shell
# 需要 Python >= 3.11。

pip install -U "langgraph-cli[inmem]"
```

</Tab>

<Tab title="Node 服务器">

```shell
npx @langchain/langgraph-cli
```

</Tab>

</Tabs>

## 2. 创建 LangGraph 应用

从 [`new-langgraph-project-python` 模板](https://github.com/langchain-ai/new-langgraph-project) 或 [`new-langgraph-project-js` 模板](https://github.com/langchain-ai/new-langgraphjs-project) 创建一个新的应用。此模板演示了一个单节点应用程序，您可以用自己的逻辑进行扩展。

<Tabs>

<Tab title="Python 服务器">

```shell
langgraph new path/to/your/app --template new-langgraph-project-python
```

</Tab>

<Tab title="Node 服务器">

```shell
langgraph new path/to/your/app --template new-langgraph-project-js
```

</Tab>

</Tabs>

<Tip>

<strong>其他模板</strong><br></br>
如果您使用 [`langgraph new`](/langsmith/cli) 而不指定模板，将会看到一个交互式菜单，您可以从可用模板列表中进行选择。

</Tip>

## 3. 安装依赖项

在您新创建的 LangGraph 应用根目录下，以 `edit` 模式安装依赖项，以便服务器使用您的本地更改：

<Tabs>

<Tab title="Python 服务器">

```shell
cd path/to/your/app
pip install -e .
```

</Tab>

<Tab title="Node 服务器">

```shell
cd path/to/your/app
yarn install
```

</Tab>

</Tabs>

## 4. 创建 `.env` 文件

您会在新 LangGraph 应用的根目录下找到一个 [`.env.example`](/langsmith/application-structure#configuration-file) 文件。在根目录下创建一个 `.env` 文件，并将 `.env.example` 文件的内容复制进去，填写必要的 API 密钥：

```bash
LANGSMITH_API_KEY=lsv2...
```

## 5. 启动 Agent Server

在本地启动 Agent Server：

<Tabs>

<Tab title="Python 服务器">

```shell
langgraph dev
```

</Tab>

<Tab title="Node 服务器">

```shell
npx @langchain/langgraph-cli dev
```

</Tab>

</Tabs>

示例输出：

```
>    Ready!
>
>    - API: [http://localhost:2024](http://localhost:2024/)
>
>    - Docs: http://localhost:2024/docs
>
>    - Studio Web UI: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024
```

[`langgraph dev`](/langsmith/cli) 命令以内存模式启动 [Agent Server](/langsmith/agent-server)。此模式适用于开发和测试目的。

<Tip>

对于生产用途，请使用持久化存储后端部署 Agent Server。更多信息，请参阅 LangSmith 的 [平台选项](/langsmith/platform-setup)。

</Tip>

## 6. 测试 API

<Tabs>

<Tab title="Python SDK (异步)">

1. 安装 LangGraph Python SDK：
```shell
pip install langgraph-sdk
```
2. 向助手发送消息（无线程运行）：
```python
from langgraph_sdk import get_client
import asyncio

client = get_client(url="http://localhost:2024")

async def main():
    async for chunk in client.runs.stream(
        None,  # 无线程运行
        "agent", # 助手名称。在 langgraph.json 中定义。
        input={
        "messages": [{
            "role": "human",
            "content": "What is LangGraph?",
            }],
        },
    ):
        print(f"Receiving new event of type: {chunk.event}...")
        print(chunk.data)
        print("\n\n")

asyncio.run(main())
```

</Tab>

<Tab title="Python SDK (同步)">

1. 安装 LangGraph Python SDK：
```shell
pip install langgraph-sdk
```
2. 向助手发送消息（无线程运行）：
```python
from langgraph_sdk import get_sync_client

client = get_sync_client(url="http://localhost:2024")

for chunk in client.runs.stream(
    None,  # 无线程运行
    "agent", # 助手名称。在 langgraph.json 中定义。
    input={
        "messages": [{
            "role": "human",
            "content": "What is LangGraph?",
        }],
    },
    stream_mode="messages-tuple",
):
    print(f"Receiving new event of type: {chunk.event}...")
    print(chunk.data)
    print("\n\n")
```

</Tab>

<Tab title="Javascript SDK">

1. 安装 LangGraph JS SDK：
```shell
npm install @langchain/langgraph-sdk
```
2. 向助手发送消息（无线程运行）：
```js
const { Client } = await import("@langchain/langgraph-sdk");

// 仅当调用 langgraph dev 时更改了默认端口，才需要设置 apiUrl
const client = new Client({ apiUrl: "http://localhost:2024"});

const streamResponse = client.runs.stream(
    null, // 无线程运行
    "agent", // 助手 ID
    {
        input: {
            "messages": [
                { "role": "user", "content": "What is LangGraph?"}
            ]
        },
        streamMode: "messages-tuple",
    }
);

for await (const chunk of streamResponse) {
    console.log(`Receiving new event of type: ${chunk.event}...`);
    console.log(JSON.stringify(chunk.data));
    console.log("\n\n");
}
```

</Tab>

<Tab title="Rest API">

```bash
curl -s --request POST \
    --url "http://localhost:2024/runs/stream" \
    --header 'Content-Type: application/json' \
    --data "{
        \"assistant_id\": \"agent\",
        \"input\": {
            \"messages\": [
                {
                    \"role\": \"human\",
                    \"content\": \"What is LangGraph?\"
                }
            ]
        },
        \"stream_mode\": \"messages-tuple\"
    }"
```

</Tab>

</Tabs>

## 后续步骤

现在您已在本地运行了一个 LangGraph 应用，可以准备部署它了：

**为 LangSmith 选择一个托管选项：**
- [**云托管**](/langsmith/cloud)：设置最快，完全托管（推荐）。
- [**混合托管**](/langsmith/hybrid)：<Tooltip tip="您的 Agent Server 和代理执行所在的运行时环境。">数据平面</Tooltip>在您的云中，<Tooltip tip="用于管理部署的 LangSmith UI 和 API。">控制平面</Tooltip>由 LangChain 管理。
- [**自托管**](/langsmith/self-hosted)：在您的基础设施中完全控制。

更多详情，请参阅 [平台设置对比](/langsmith/platform-setup)。

**然后部署您的应用：**
- [部署到云快速入门](/langsmith/deployment-quickstart)：快速设置指南。
- [完整的云设置指南](/langsmith/deploy-to-cloud)：全面的部署文档。

**探索功能：**
- **[Studio](/langsmith/studio)**：使用 Studio UI 可视化、交互和调试您的应用程序。尝试 [Studio 快速入门](/langsmith/quick-start-studio)。
- **API 参考**：[LangSmith 部署 API](https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref/)、[Python SDK](/langsmith/langgraph-python-sdk)、[JS/TS SDK](/langsmith/langgraph-js-ts-sdk)
