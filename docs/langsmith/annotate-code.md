---
title: 自定义插装
sidebarTitle: Custom instrumentation
---

<Note>

如果您决定不再追踪运行记录，可以移除 `LANGSMITH_TRACING` 环境变量。请注意，这不会影响 `RunTree` 对象或 API 用户，因为这些是底层接口，不受追踪开关的影响。

</Note>

有几种方法可以将追踪记录（traces）记录到 LangSmith。

<Check>

如果您正在使用 LangChain（Python 或 JS/TS 版本），可以跳过本节，直接查看 [LangChain 专用说明](/langsmith/trace-with-langchain)。

</Check>

## 使用 `@traceable` / `traceable`

LangSmith 通过 Python 中的 `@traceable` 装饰器和 TypeScript 中的 `traceable` 函数，让您能够以最小的代码改动轻松记录追踪。

<Note>

即使使用 `@traceable` 或 `traceable`，也必须将 `LANGSMITH_TRACING` 环境变量设置为 `'true'`，才能将追踪记录到 LangSmith。这允许您在不更改代码的情况下开关追踪功能。

此外，您需要将 `LANGSMITH_API_KEY` 环境变量设置为您的 API 密钥（更多信息请参阅[设置](/)）。

默认情况下，追踪将记录到名为 `default` 的项目中。要将追踪记录到其他项目，请参阅[此部分](/langsmith/log-traces-to-project)。

</Note>

`@traceable` 装饰器是记录来自 LangSmith Python SDK 追踪的简单方法。只需用 `@traceable` 装饰任何函数。

请注意，当用 `traceable` 包装同步函数时（例如下面的 `formatPrompt`），调用时应使用 `await` 关键字，以确保追踪被正确记录。

::: code-group

```python [Python]
from langsmith import traceable
from openai import Client

openai = Client()

@traceable
def format_prompt(subject):
  return [
      {
          "role": "system",
          "content": "You are a helpful assistant.",
      },
      {
          "role": "user",
          "content": f"What's a good name for a store that sells {subject}?"
      }
  ]

@traceable(run_type="llm")
def invoke_llm(messages):
  return openai.chat.completions.create(
      messages=messages, model="gpt-4o-mini", temperature=0
  )

@traceable
def parse_output(response):
  return response.choices[0].message.content

@traceable
def run_pipeline():
  messages = format_prompt("colorful socks")
  response = invoke_llm(messages)
  return parse_output(response)

run_pipeline()
```

```typescript [TypeScript]
import { traceable } from "langsmith/traceable";
import OpenAI from "openai";

const openai = new OpenAI();

const formatPrompt = traceable((subject: string) => {
  return [
    {
      role: "system" as const,
      content: "You are a helpful assistant.",
    },
    {
      role: "user" as const,
      content: `What's a good name for a store that sells ${subject}?`,
    },
  ];
},{ name: "formatPrompt" });

const invokeLLM = traceable(
  async ({ messages }: { messages: { role: string; content: string }[] }) => {
      return openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: messages,
          temperature: 0,
      });
  },
  { run_type: "llm", name: "invokeLLM" }
);

const parseOutput = traceable(
  (response: any) => {
      return response.choices[0].message.content;
  },
  { name: "parseOutput" }
);

const runPipeline = traceable(
  async () => {
      const messages = await formatPrompt("colorful socks");
      const response = await invokeLLM({ messages });
      return parseOutput(response);
  },
  { name: "runPipeline" }
);

await runPipeline();
```

:::

![注释代码追踪](/langsmith/images/annotate-code-trace.gif)

## 使用 `trace` 上下文管理器（仅限 Python）

在 Python 中，您可以使用 `trace` 上下文管理器将追踪记录到 LangSmith。这在以下情况下很有用：

1.  您希望记录特定代码块的追踪。
2.  您希望控制追踪的输入、输出和其他属性。
3.  使用装饰器或包装器不可行。
4.  以上任何或所有情况。

该上下文管理器与 `traceable` 装饰器和 `wrap_openai` 包装器无缝集成，因此您可以在同一个应用程序中一起使用它们。

```python
import openai
import langsmith as ls
from langsmith.wrappers import wrap_openai

client = wrap_openai(openai.Client())

@ls.traceable(run_type="tool", name="Retrieve Context")
def my_tool(question: str) -> str:
    return "During this morning's meeting, we solved all world conflict."

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

app_inputs = {"input": "Can you summarize this morning's meetings?"}

with ls.trace("Chat Pipeline", "chain", project_name="my_test", inputs=app_inputs) as rt:
    output = chat_pipeline("Can you summarize this morning's meetings?")
    rt.end(outputs={"output": output})
```

## 使用 `RunTree` API

另一种更显式地将追踪记录到 LangSmith 的方法是通过 `RunTree` API。此 API 为您提供对追踪的更多控制——您可以手动创建运行（runs）和子运行来组装您的追踪。您仍然需要设置 `LANGSMITH_API_KEY`，但此方法不需要 `LANGSMITH_TRACING`。

不建议使用此方法，因为在传播追踪上下文时更容易出错。

::: code-group

```python [Python]
import openai
from langsmith.run_trees import RunTree

# 这可以是您应用程序的用户输入
question = "Can you summarize this morning's meetings?"

# 创建一个顶级运行
pipeline = RunTree(
  name="Chat Pipeline",
  run_type="chain",
  inputs={"question": question}
)
pipeline.post()

# 这可以在检索步骤中获取
context = "During this morning's meeting, we solved all world conflict."
messages = [
  { "role": "system", "content": "You are a helpful assistant. Please respond to the user's request only based on the given context." },
  { "role": "user", "content": f"Question: {question}\nContext: {context}"}
]

# 创建一个子运行
child_llm_run = pipeline.create_child(
  name="OpenAI Call",
  run_type="llm",
  inputs={"messages": messages},
)
child_llm_run.post()

# 生成一个完成（completion）
client = openai.Client()
chat_completion = client.chat.completions.create(
  model="gpt-4o-mini", messages=messages
)

# 结束运行并记录它们
child_llm_run.end(outputs=chat_completion)
child_llm_run.patch()
pipeline.end(outputs={"answer": chat_completion.choices[0].message.content})
pipeline.patch()
```

```typescript [TypeScript]
import OpenAI from "openai";
import { RunTree } from "langsmith";

// 这可以是您应用程序的用户输入
const question = "Can you summarize this morning's meetings?";

const pipeline = new RunTree({
  name: "Chat Pipeline",
  run_type: "chain",
  inputs: { question }
});
await pipeline.postRun();

// 这可以在检索步骤中获取
const context = "During this morning's meeting, we solved all world conflict.";
const messages = [
  { role: "system", content: "You are a helpful assistant. Please respond to the user's request only based on the given context." },
  { role: "user", content: `Question: ${question}Context: ${context}` }
];

// 创建一个子运行
const childRun = await pipeline.createChild({
  name: "OpenAI Call",
  run_type: "llm",
  inputs: { messages },
});
await childRun.postRun();

// 生成一个完成（completion）
const client = new OpenAI();
const chatCompletion = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: messages,
});

// 结束运行并记录它们
childRun.end(chatCompletion);
await childRun.patchRun();
pipeline.end({ outputs: { answer: chatCompletion.choices[0].message.content } });
await pipeline.patchRun();
```

:::

## 使用示例

您可以扩展上述工具来方便地追踪任何代码。以下是一些示例扩展：

追踪类中的任何公共方法：

```python
from typing import Any, Callable, Type, TypeVar

T = TypeVar("T")

def traceable_cls(cls: Type[T]) -> Type[T]:
    """Instrument all public methods in a class."""
    def wrap_method(name: str, method: Any) -> Any:
        if callable(method) and not name.startswith("__"):
            return traceable(name=f"{cls.__name__}.{name}")(method)
        return method

    # Handle __dict__ case
    for name in dir(cls):
        if not name.startswith("_"):
            try:
                method = getattr(cls, name)
                setattr(cls, name, wrap_method(name, method))
            except AttributeError:
                # Skip attributes that can't be set (e.g., some descriptors)
                pass

    # Handle __slots__ case
    if hasattr(cls, "__slots__"):
        for slot in cls.__slots__:  # type: ignore[attr-defined]
            if not slot.startswith("__"):
                try:
                    method = getattr(cls, slot)
                    setattr(cls, slot, wrap_method(slot, method))
                except AttributeError:
                    # Skip slots that don't have a value yet
                    pass

    return cls

@traceable_cls
class MyClass:
    def __init__(self, some_val: int):
        self.some_val = some_val

    def combine(self, other_val: int):
        return self.some_val + other_val

# See trace: https://smith.langchain.com/public/882f9ecf-5057-426a-ae98-0edf84fdcaf9/r
MyClass(13).combine(29)
```

## 确保在退出前提交所有追踪

LangSmith 的追踪在后台线程中完成，以避免阻塞您的生产应用程序。这意味着您的进程可能在所有追踪成功发布到 LangSmith 之前结束。以下是一些确保在退出应用程序前提交所有追踪的选项。

### 使用 LangSmith SDK

如果您独立使用 LangSmith SDK，可以在退出前使用 `flush` 方法：

::: code-group

```python [Python]
from langsmith import Client

client = Client()

@traceable(client=client)
async def my_traced_func():
  # Your code here...
  pass

try:
  await my_traced_func()
finally:
  await client.flush()
```

```typescript [TypeScript]
import { Client } from "langsmith";

const langsmithClient = new Client({});

const myTracedFunc = traceable(async () => {
  // Your code here...
},{ client: langsmithClient });

try {
  await myTracedFunc();
} finally {
  await langsmithClient.flush();
}
```

:::

### 使用 LangChain

如果您正在使用 LangChain，请参考我们的 [LangChain 追踪指南](/langsmith/trace-with-langchain#ensure-all-traces-are-submitted-before-exiting)。

如果您更喜欢视频教程，请查看 LangSmith 入门课程中的[追踪基础视频](https://academy.langchain.com/pages/intro-to-langsmith-preview)。
