[Agent Chat UI](https://github.com/langchain-ai/agent-chat-ui) 是一个 Next.js 应用程序，它为与任何 LangChain 智能体（agent）交互提供了一个对话式界面。它支持实时聊天、工具可视化以及时间旅行调试（time-travel debugging）和状态分叉（state forking）等高级功能。Agent Chat UI 能与使用 [`create_agent`](/oss/python/langchain/agents) 创建的智能体无缝协作，并以最少的设置为您的智能体提供交互式体验，无论您是在本地运行还是在部署环境中运行（例如 [LangSmith](/langsmith/home)）。

Agent Chat UI 是开源的，可以根据您的应用需求进行调整。

<Frame>

<iframe
  className="w-full aspect-video rounded-xl"
  src="https://www.youtube.com/embed/lInrwVnZ83o?si=Uw66mPtCERJm0EjU"
  title="Agent Chat UI"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

</Frame>

<Tip>

您可以在 Agent Chat UI 中使用生成式 UI（generative UI）。有关更多信息，请参阅 [使用 LangGraph 实现生成式用户界面](/langsmith/generative-ui-react)。

</Tip>

### 快速开始

最快上手的方法是使用托管版本：

1.  **访问 [Agent Chat UI](https://agentchat.vercel.app)**
2.  **连接您的智能体**，输入您的部署 URL 或本地服务器地址
3.  **开始聊天** - UI 将自动检测并渲染工具调用（tool calls）和中断（interrupts）

### 本地开发

如需自定义或进行本地开发，您可以在本地运行 Agent Chat UI：

::: code-group

```bash [使用 npx]
# 创建一个新的 Agent Chat UI 项目
npx create-agent-chat-app --project-name my-chat-ui
cd my-chat-ui

# 安装依赖并启动
pnpm install
pnpm dev
```

```bash [克隆仓库]
# 克隆仓库
git clone https://github.com/langchain-ai/agent-chat-ui.git
cd agent-chat-ui

# 安装依赖并启动
pnpm install
pnpm dev
```

:::

