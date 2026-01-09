## 选择性追踪

您可以使用 LangSmith 的 `tracing_context` 上下文管理器选择性地追踪特定调用或应用程序的某些部分：

```ts
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain";

// 这将被追踪
const tracer = new LangChainTracer();
await agent.invoke(
  {
    messages: [{role: "user", content: "Send a test email to alice@example.com"}]
  },
  { callbacks: [tracer] }
);

// 这将不会被追踪（如果未设置 LANGSMITH_TRACING 环境变量）
await agent.invoke(
  {
    messages: [{role: "user", content: "Send another email"}]
  }
);
```

## 记录到项目

:::: details 静态设置

您可以通过设置 `LANGSMITH_PROJECT` 环境变量为整个应用程序设置自定义项目名称：

```bash
export LANGSMITH_PROJECT=my-agent-project
```

::::

:::: details 动态设置

您可以通过编程方式为特定操作设置项目名称：

```ts
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain";

const tracer = new LangChainTracer({ projectName: "email-agent-test" });
await agent.invoke(
  {
    messages: [{role: "user", content: "Send a test email to alice@example.com"}]
  },
  { callbacks: [tracer] }
);
```

::::

## 向追踪添加元数据

您可以使用自定义元数据和标签来注释您的追踪：

```ts
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain";

const tracer = new LangChainTracer({ projectName: "email-agent-test" });
await agent.invoke(
  {
    messages: [{role: "user", content: "Send a test email to alice@example.com"}]
  },
  config: {
    tags: ["production", "email-assistant", "v1.0"],
    metadata: {
      userId: "user123",
      sessionId: "session456",
      environment: "production"
    }
  },
);
```

这些自定义元数据和标签将被附加到 LangSmith 中的追踪记录上。

<Tip>

要了解更多关于如何使用追踪来调试、评估和监控您的智能体（agent），请参阅 [LangSmith 文档](/langsmith/home)。

</Tip>

