---
title: LangSmith Studio
---
在本地使用 LangChain 构建智能体（agent）时，可视化智能体内部运行情况、实时交互以及调试出现的问题会非常有帮助。**LangSmith Studio** 是一个免费的视觉界面，用于从本地机器开发和测试您的 LangChain 智能体。

Studio 连接到您本地运行的智能体，向您展示智能体执行的每个步骤：发送给模型的提示（prompts）、工具调用及其结果，以及最终输出。您可以测试不同的输入、检查中间状态，并在无需额外代码或部署的情况下迭代优化智能体的行为。

本页描述了如何为您的本地 LangChain 智能体设置 Studio。

## 先决条件

开始之前，请确保您具备以下条件：

- **一个 LangSmith 账户**：在 [smith.langchain.com](https://smith.langchain.com) 免费注册或登录。
- **一个 LangSmith API 密钥**：请遵循[创建 API 密钥](/langsmith/create-account-api-key#create-an-api-key)指南。
- 如果您不希望数据被[追踪](/langsmith/observability-concepts#traces)到 LangSmith，请在您应用的 `.env` 文件中设置 `LANGSMITH_TRACING=false`。禁用追踪后，数据不会离开您的本地服务器。

## 设置本地智能体服务器

### 1. 安装 LangGraph CLI

[LangGraph CLI](/langsmith/cli) 提供了一个本地开发服务器（也称为[智能体服务器](/langsmith/agent-server)），用于将您的智能体连接到 Studio。

```shell
npx @langchain/langgraph-cli
```

### 2. 准备您的智能体

如果您已经有一个 LangChain 智能体，可以直接使用它。本示例使用一个简单的邮件智能体：

```typescript title="agent.ts"
import { createAgent } from "@langchain/langgraph";

function sendEmail(to: string, subject: string, body: string): string {
    // Send an email
    const email = {
        to: to,
        subject: subject,
        body: body
    };
    // ... email sending logic

    return `Email sent to ${to}`;
}

const agent = createAgent({
    model: "gpt-4o",
    tools: [sendEmail],
    systemPrompt: "You are an email assistant. Always use the sendEmail tool.",
});

export { agent };
```

### 3. 环境变量

Studio 需要一个 LangSmith API 密钥来连接您的本地智能体。在项目根目录下创建一个 `.env` 文件，并添加您从 [LangSmith](https://smith.langchain.com/settings) 获取的 API 密钥。

<Warning>

请确保您的 `.env` 文件不会被提交到版本控制系统（如 Git）。

</Warning>

```bash [.env]
LANGSMITH_API_KEY=lsv2...
```

### 4. 创建 LangGraph 配置文件

LangGraph CLI 使用一个配置文件来定位您的智能体并管理依赖项。在您的应用目录中创建一个 `langgraph.json` 文件：

```json title="langgraph.json"
{
  "dependencies": ["."],
  "graphs": {
    "agent": "./src/agent.ts:agent"
  },
  "env": ".env"
}
```

<a href="https://reference.langchain.com/javascript/functions/langchain.index.createAgent.html" target="_blank" rel="noreferrer" class="link"><code>createAgent</code></a> 函数会自动返回一个已编译的 LangGraph 图（graph），这正是配置文件中 `graphs` 键所期望的内容。

<Info>

有关配置文件中 JSON 对象每个键的详细解释，请参阅 [LangGraph 配置文件参考](/langsmith/cli#configuration-file)。

</Info>

此时，项目结构将如下所示：

```bash
my-app/
├── src
│   └── agent.ts
├── .env
├── package.json
└── langgraph.json
```

### 5. 安装依赖项

```shell
yarn install
```

### 6. 在 Studio 中查看您的智能体

启动开发服务器，将您的智能体连接到 Studio：

```shell
npx @langchain/langgraph-cli dev
```

<Warning>

Safari 浏览器会阻止到 Studio 的 `localhost` 连接。要解决此问题，请使用 `--tunnel` 参数运行上述命令，以便通过安全隧道访问 Studio。

</Warning>

服务器运行后，您的智能体既可以通过 API 在 `http://127.0.0.1:2024` 访问，也可以通过 Studio UI 在 `https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024` 访问：

<Frame>

![Studio UI 中的智能体视图](/oss/images/studio_create-agent.png)

</Frame>

当 Studio 连接到您的本地智能体后，您可以快速迭代优化智能体的行为。运行测试输入，检查完整的执行轨迹（trace），包括提示、工具参数、返回值以及令牌/延迟指标。当出现问题时，Studio 会捕获异常及其周围状态，帮助您理解发生了什么。

开发服务器支持热重载（hot-reloading）—— 在代码中修改提示或工具签名，Studio 会立即反映这些更改。您可以从任何步骤重新运行对话线程来测试您的更改，而无需从头开始。此工作流程适用于从简单的单工具智能体到复杂的多节点图。

有关如何运行 Studio 的更多信息，请参阅 [LangSmith 文档](/langsmith/home)中的以下指南：

- [运行应用](/langsmith/use-studio#run-application)
- [管理助手](/langsmith/use-studio#manage-assistants)
- [管理线程](/langsmith/use-studio#manage-threads)
- [迭代提示](/langsmith/observability-studio)
- [调试 LangSmith 轨迹](/langsmith/observability-studio#debug-langsmith-traces)
- [将节点添加到数据集](/langsmith/observability-studio#add-node-to-dataset)

## 视频指南

<Frame>

<iframe
  className="w-full aspect-video rounded-xl"
  src="https://www.youtube.com/embed/Mi1gSlHwZLM?si=zA47TNuTC5aH0ahd"
  title="Studio"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

</Frame>

