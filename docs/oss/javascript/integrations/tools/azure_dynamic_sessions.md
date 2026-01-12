---
title: Azure Container Apps 动态会话
---
> [Azure Container Apps 动态会话](https://learn.microsoft.com/azure/container-apps/sessions) 提供对安全沙盒环境的快速访问，这些环境非常适合运行需要与其他工作负载强隔离的代码或应用程序。

你可以在[此页面](https://learn.microsoft.com/azure/container-apps/sessions)了解更多关于 Azure Container Apps 动态会话及其代码解释能力的信息。如果你没有 Azure 账户，可以[创建一个免费账户](https://azure.microsoft.com/free/)开始使用。

## 设置

首先，你需要安装 [`@langchain/azure-dynamic-sessions`](https://www.npmjs.com/package/@langchain/azure-dynamic-sessions) 包：

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/javascript/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/azure-dynamic-sessions @langchain/core
```

你还需要有一个正在运行的代码解释器会话池实例。你可以按照[此指南](https://learn.microsoft.com/azure/container-apps/sessions-code-interpreter)使用 [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) 部署一个版本。

一旦你的实例运行起来，你需要确保已为其正确设置 Azure Entra 身份验证。你可以在[这里](https://learn.microsoft.com/azure/container-apps/sessions?tabs=azure-cli#authentication)找到如何操作的说明。

在为你的身份添加角色后，你需要获取 **会话池管理端点**。你可以在 Azure 门户中，实例的“概览”部分下找到它。然后你需要设置以下环境变量：

```bash [.env example]
AZURE_CONTAINER_APP_SESSION_POOL_MANAGEMENT_ENDPOINT=<your_endpoint>
```

## 使用示例

下面是一个简单的示例，它创建一个新的 Python 代码解释器会话，调用工具并打印结果。

```typescript
import { SessionsPythonREPLTool } from "@langchain/azure-dynamic-sessions";

const tool = new SessionsPythonREPLTool({
  poolManagementEndpoint:
    process.env.AZURE_CONTAINER_APP_SESSION_POOL_MANAGEMENT_ENDPOINT || "",
});

const result = await tool.invoke("print('Hello, World!')\n1+2");

console.log(result);

// {
//   stdout: "Hello, World!\n",
//   stderr: "",
//   result: 3,
// }
```

这是一个完整的示例，我们使用 Azure OpenAI 聊天模型来调用 Python 代码解释器会话工具以执行代码并获取结果：

```typescript
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "@langchain/classic/hub";
import { AgentExecutor, createToolCallingAgent } from "@langchain/classic/agents";
import { SessionsPythonREPLTool } from "@langchain/azure-dynamic-sessions";
import { AzureChatOpenAI } from "@langchain/openai";

const tools = [
  new SessionsPythonREPLTool({
    poolManagementEndpoint:
      process.env.AZURE_CONTAINER_APP_SESSION_POOL_MANAGEMENT_ENDPOINT || "",
  }),
];

// 注意：你需要一个支持函数调用的模型部署，
// 例如 `gpt-35-turbo` 版本 `1106`。
const llm = new AzureChatOpenAI({
  temperature: 0,
});

// 获取要使用的提示词 - 你可以修改它！
// 如果你想查看完整的提示词，可以访问：
// https://smith.langchain.com/hub/jacob/tool-calling-agent
const prompt = await pull<ChatPromptTemplate>("jacob/tool-calling-agent");

const agent = await createToolCallingAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
});

const result = await agentExecutor.invoke({
  input:
    "Create a Python program that prints the Python version and return the result.",
});

console.log(result);
```

## 相关

- 工具 [概念指南](/oss/javascript/langchain/tools)
- 工具 [操作指南](/oss/javascript/langchain/tools)
