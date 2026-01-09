---
title: 运行本地服务器
sidebarTitle: Local server
---
本指南将向您展示如何在本地运行 LangGraph 应用程序。

## 前提条件

开始之前，请确保您已具备以下条件：

* 一个 [LangSmith](https://smith.langchain.com/settings) 的 API 密钥 - 可免费注册

## 1. 安装 LangGraph CLI

```shell
npm install --save-dev @langchain/langgraph-cli
```

## 2. 创建 LangGraph 应用

使用 [`new-langgraph-project-js` 模板](https://github.com/langchain-ai/new-langgraphjs-project) 创建一个新应用。此模板演示了一个单节点应用程序，您可以用自己的逻辑进行扩展。

```shell
npm create langgraph
```

:::: details 将 LangGraph 添加到现有项目

如果您有一个包含 LangGraph 代理的现有项目，可以使用 `config` 命令自动生成 `langgraph.json` 配置文件：

```shell
npm create langgraph config
```

此命令会扫描您的项目以查找 LangGraph 代理（例如 `createAgent()`、`StateGraph.compile()` 或 `workflow.compile()` 模式），并生成一个包含所有已导出代理的配置文件。

示例输出：

```json
{
  "node_version": "24",
  "graphs": {
    "agent": "./src/agent.ts:agent",
    "searchAgent": "./src/search.ts:searchAgent"
  },
  "env": ".env"
}
```

<Tip>

只有<strong>已导出</strong>的代理才会包含在配置中。如果某个代理未导出，命令会发出警告，以便您添加 `export` 关键字。

</Tip>

::::

## 3. 安装依赖项

在您的新 LangGraph 应用的根目录下，以 `edit` 模式安装依赖项，以便服务器使用您的本地更改：

```shell
cd path/to/your/app
npm install
```

## 4. 创建 `.env` 文件

您会在新 LangGraph 应用的根目录下找到一个 `.env.example` 文件。在根目录下创建一个 `.env` 文件，并将 `.env.example` 文件的内容复制进去，填写必要的 API 密钥：

```bash
LANGSMITH_API_KEY=lsv2...
```

## 5. 启动代理服务器

在本地启动 LangGraph API 服务器：

```shell
npx @langchain/langgraph-cli dev
```

示例输出：

```
INFO:langgraph_api.cli:

        Welcome to

╦  ┌─┐┌┐┌┌─┐╔═╗┬─┐┌─┐┌─┐┬ ┬
║  ├─┤││││ ┬║ ╦├┬┘├─┤├─┘├─┤
╩═╝┴ ┴┘└┘└─┘╚═╝┴└─┴ ┴┴  ┴ ┴

- 🚀 API: http://127.0.0.1:2024
- 🎨 Studio UI: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024
- 📚 API Docs: http://127.0.0.1:2024/docs

This in-memory server is designed for development and testing.
For production use, please use LangSmith Deployment.
```

`langgraph dev` 命令以内存模式启动代理服务器。此模式适用于开发和测试目的。对于生产用途，请部署具有持久存储后端访问权限的代理服务器。更多信息，请参阅 [平台设置概述](/langsmith/platform-setup)。

## 6. 在 Studio 中测试您的应用

[Studio](/langsmith/studio) 是一个专门的用户界面，您可以将其连接到 LangGraph API 服务器，以在本地可视化、交互和调试您的应用程序。通过访问 `langgraph dev` 命令输出中提供的 URL，在 Studio 中测试您的图：

```
>    - LangGraph Studio Web UI: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024
```

对于在自定义主机/端口上运行的代理服务器，请更新 URL 中的 `baseUrl` 查询参数。例如，如果您的服务器运行在 `http://myhost:3000`：

```
https://smith.langchain.com/studio/?baseUrl=http://myhost:3000
```

:::: details Safari 兼容性

在命令中使用 `--tunnel` 标志来创建安全隧道，因为 Safari 在连接到 localhost 服务器时存在限制：

```shell
langgraph dev --tunnel
```

::::

## 7. 测试 API

<Tabs>

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

现在您已经在本地运行了一个 LangGraph 应用，可以通过探索部署和高级功能来进一步推进您的旅程：

* [部署快速入门](/langsmith/deployment-quickstart)：使用 LangSmith 部署您的 LangGraph 应用。
* [LangSmith](/langsmith/home)：了解 LangSmith 的基础概念。

* [SDK 参考](https://reference.langchain.com/javascript/modules/_langchain_langgraph-sdk.html)：探索 SDK API 参考。

