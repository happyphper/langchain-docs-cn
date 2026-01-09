Python/TypeScript 中的 `wrap_openai`/`wrapOpenAI` 方法允许你包装你的 OpenAI 客户端，以便自动记录追踪信息——无需使用装饰器或函数包装！使用包装器可以确保消息（包括工具调用和多模态内容块）在 LangSmith 中能够良好地呈现。同时请注意，该包装器可以与 `@traceable` 装饰器或 `traceable` 函数无缝协作，你可以在同一个应用程序中同时使用它们。

<Note>

即使在使用 `wrap_openai` 或 `wrapOpenAI` 时，也必须将 `LANGSMITH_TRACING` 环境变量设置为 `'true'`，才能将追踪信息记录到 LangSmith。这允许你在不更改代码的情况下开启或关闭追踪功能。

此外，你需要将 `LANGSMITH_API_KEY` 环境变量设置为你的 API 密钥（更多信息请参阅[设置](/)）。

如果你的 LangSmith API 密钥关联了多个工作区，请设置 `LANGSMITH_WORKSPACE_ID` 环境变量来指定要使用的工作区。

默认情况下，追踪信息将记录到名为 `default` 的项目中。要将追踪信息记录到其他项目，请参阅[此部分](/langsmith/log-traces-to-project)。

</Note>

::: code-group

```python [Python]
import openai
from langsmith import traceable
from langsmith.wrappers import wrap_openai

client = wrap_openai(openai.Client())

@traceable(run_type="tool", name="Retrieve Context")
def my_tool(question: str) -> str:
  return "During this morning's meeting, we solved all world conflict."

@traceable(name="Chat Pipeline")
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

chat_pipeline("Can you summarize this morning's meetings?")
```

```typescript [TypeScript]
import OpenAI from "openai";
import { traceable } from "langsmith/traceable";
import { wrapOpenAI } from "langsmith/wrappers";

const client = wrapOpenAI(new OpenAI());

const myTool = traceable(async (question: string) => {
  return "During this morning's meeting, we solved all world conflict.";
}, { name: "Retrieve Context", run_type: "tool" });

const chatPipeline = traceable(async (question: string) => {
  const context = await myTool(question);
  const messages = [
      {
          role: "system",
          content:
              "You are a helpful assistant. Please respond to the user's request only based on the given context.",
      },
      { role: "user", content: `Question: ${question} Context: ${context}` },
  ];
  const chatCompletion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
  });
  return chatCompletion.choices[0].message.content;
}, { name: "Chat Pipeline" });

await chatPipeline("Can you summarize this morning's meetings?");
```

:::

