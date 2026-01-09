---
title: 无需设置环境变量进行追踪
sidebarTitle: Trace without env vars
keywords: 'cloudflare, cloudflare workers, serverless'
---
如其他指南所述，以下环境变量允许您配置是否启用追踪、API 端点、API 密钥和追踪项目：

* `LANGSMITH_TRACING`
* `LANGSMITH_API_KEY`
* `LANGSMITH_ENDPOINT`
* `LANGSMITH_PROJECT`

如果您需要使用自定义配置追踪运行，或者您所处的环境不支持典型的环境变量（例如 Cloudflare Workers），或者您只是不希望依赖环境变量，LangSmith 允许您通过编程方式配置追踪。

<Warning>

由于许多用户要求使用 `trace` 上下文管理器对追踪进行更细粒度的控制，<strong>我们在 Python SDK 的 0.1.95 版本中更改了 `with trace` 的行为</strong>，使其遵循 `LANGSMITH_TRACING` 环境变量。您可以在[发布说明](https://github.com/langchain-ai/langsmith-sdk/releases/tag/v0.1.95)中找到更多详细信息。在不设置环境变量的情况下禁用/启用追踪的推荐方法是使用 `with tracing_context` 上下文管理器，如下例所示。

</Warning>

- Python：在 Python 中实现此目的的推荐方法是使用 `tracing_context` 上下文管理器。这适用于使用 `traceable` 注解的代码和 `trace` 上下文管理器内的代码。
- TypeScript：您可以将客户端和 `tracingEnabled` 标志传递给 `traceable` 装饰器。

::: code-group

```python [Python]
import openai
from langsmith import Client, tracing_context, traceable
from langsmith.wrappers import wrap_openai

langsmith_client = Client(
  api_key="YOUR_LANGSMITH_API_KEY",  # 可以从密钥管理器获取
  api_url="https://api.smith.langchain.com",  # 针对自托管安装或欧盟区域进行适当更新
  workspace_id="YOUR_WORKSPACE_ID", # 对于作用域为多个工作空间的 API 密钥，必须指定
)

client = wrap_openai(openai.Client())

@traceable(run_type="tool", name="Retrieve Context")
def my_tool(question: str) -> str:
  return "During this morning's meeting, we solved all world conflict."

@traceable
def chat_pipeline(question: str):
  context = my_tool(question)
  messages = [
      { "role": "system", "content": "You are a helpful assistant. Please respond to the user's request only based on the given context." },
      { "role": "user", "content": f"Question: {question}\nContext: {context}"}
  ]
  chat_completion = client.chat.completions.create(
      model="gpt-4o-mini", messages=messages
  )
  return chat_completion.choices[0].message.content

# 可以设置为 False 以在此处禁用追踪，而无需更改代码结构
with tracing_context(enabled=True):
  # 使用 langsmith_extra 传入自定义客户端
  chat_pipeline("Can you summarize this morning's meetings?", langsmith_extra={"client": langsmith_client})
```

```typescript [TypeScript]
import { Client } from "langsmith";
import { traceable } from "langsmith/traceable";
import { wrapOpenAI } from "langsmith/wrappers";
import { OpenAI } from "openai";

const client = new Client({
    apiKey: "YOUR_API_KEY",  // 可以从密钥管理器获取
    apiUrl: "https://api.smith.langchain.com",  // 针对自托管安装或欧盟区域进行适当更新
});

const openai = wrapOpenAI(new OpenAI());

const tool = traceable((question: string) => {
    return "During this morning's meeting, we solved all world conflict.";
}, { name: "Retrieve Context", runType: "tool" });

const pipeline = traceable(
    async (question: string) => {
        const context = await tool(question);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system" as const, content: "You are a helpful assistant. Please respond to the user's request only based on the given context." },
                { role: "user" as const, content: `Question: ${question}\nContext: ${context}`}
            ]
        });

        return completion.choices[0].message.content;
    },
    { name: "Chat", client, tracingEnabled: true }
);

await pipeline("Can you summarize this morning's meetings?");
```

:::

如果您更喜欢视频教程，请查看 LangSmith 入门课程中的[替代追踪方式视频](https://academy.langchain.com/pages/intro-to-langsmith-preview)。
