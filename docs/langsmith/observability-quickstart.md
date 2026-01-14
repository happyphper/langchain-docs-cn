---
title: 追踪快速入门
sidebarTitle: Quickstart
---

[_可观测性_](/langsmith/observability-concepts) 是使用大型语言模型（LLM）构建的应用程序的关键需求。LLM 具有非确定性，这意味着相同的提示可能产生不同的响应。这种行为使得调试和监控比传统软件更具挑战性。

LangSmith 通过提供应用程序如何处理请求的端到端可见性来解决这个问题。每个请求都会生成一个 [_追踪_](/langsmith/observability-concepts#traces)，它捕获了所发生事件的完整记录。在一个追踪内部是独立的 [_运行_](/langsmith/observability-concepts#runs)，即您的应用程序执行的具体操作，例如一次 LLM 调用或一个检索步骤。追踪运行允许您检查、调试和验证应用程序的行为。

在本快速入门中，您将设置一个最小的 [_检索增强生成（RAG）_](https://www.mckinsey.com/featured-insights/mckinsey-explainers/what-is-retrieval-augmented-generation-rag) 应用程序，并使用 LangSmith 添加追踪功能。您将：

1.  配置您的环境。
2.  创建一个用于检索上下文并调用 LLM 的应用程序。
3.  启用追踪以捕获检索步骤和 LLM 调用。
4.  在 LangSmith UI 中查看生成的追踪。

<Tip>

如果您更喜欢观看关于开始使用追踪的视频，请参考快速入门的 [视频指南](#video-guide)。

</Tip>

## 先决条件

在开始之前，请确保您拥有：

*   **一个 LangSmith 账户**：在 [smith.langchain.com](https://smith.langchain.com) 注册或登录。
*   **一个 LangSmith API 密钥**：请遵循 [创建 API 密钥](/langsmith/create-account-api-key#create-an-api-key) 指南。
*   **一个 OpenAI API 密钥**：从 [OpenAI 仪表板](https://platform.openai.com/account/api-keys) 生成。

本快速入门中的示例应用程序将使用 OpenAI 作为 LLM 提供商。您可以针对您应用程序的 LLM 提供商调整此示例。

<Tip>

如果您正在使用 [LangChain](https://python.langchain.com/docs/introduction/) 或 [LangGraph](https://langchain-ai.github.io/langgraph/) 构建应用程序，您可以通过一个环境变量启用 LangSmith 追踪。请阅读 [使用 LangChain 进行追踪](/langsmith/trace-with-langchain) 或 [使用 LangGraph 进行追踪](/langsmith/trace-with-langgraph) 的指南以开始使用。

</Tip>

## 1. 创建目录并安装依赖项

在您的终端中，为您的项目创建一个目录并在您的环境中安装依赖项：

::: code-group

```bash [Python]
mkdir ls-observability-quickstart && cd ls-observability-quickstart
python -m venv .venv && source .venv/bin/activate
python -m pip install --upgrade pip
pip install -U langsmith openai
```

```bash [TypeScript]
mkdir ls-observability-quickstart-ts && cd ls-observability-quickstart-ts
npm init -y
npm install langsmith openai typescript ts-node
npx tsc --init
```

:::

## 2. 设置环境变量

设置以下环境变量：

*   `LANGSMITH_TRACING`
*   `LANGSMITH_API_KEY`
*   `OPENAI_API_KEY`（或您的 LLM 提供商的 API 密钥）
*   （可选）`LANGSMITH_WORKSPACE_ID`：如果您的 LangSmith API 密钥链接到多个工作区，请设置此变量以指定要使用的工作区。

``` bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY="<your-langsmith-api-key>"
export OPENAI_API_KEY="<your-openai-api-key>"
export LANGSMITH_WORKSPACE_ID="<your-workspace-id>"
```

如果您使用 Anthropic，请使用 [Anthropic 包装器](/langsmith/annotate-code#wrap-the-anthropic-client-python-only) 来追踪您的调用。对于其他提供商，请使用 [可追踪包装器](/langsmith/annotate-code#use-%40traceable-%2F-traceable)。

<Note>

<!--@include: @/snippets/python/langsmith/trace-ingestion-project.md-->

</Note>

## 3. 定义您的应用程序

您可以使用此步骤中概述的示例应用程序代码来检测一个 RAG 应用程序。或者，您可以使用包含 LLM 调用的自己的应用程序代码。

这是一个尚未添加任何 LangSmith 追踪功能的最小化 RAG 应用，它直接使用 OpenAI SDK。它包含三个主要部分：

- **检索器函数**：模拟文档检索，始终返回相同的字符串。
- **OpenAI 客户端**：实例化一个普通的 OpenAI 客户端以发送聊天补全请求。
- **RAG 函数**：将检索到的文档与用户问题结合，形成系统提示，使用 `gpt-4o-mini` 调用 `chat.completions.create()` 端点，并返回助手的响应。

将以下代码添加到您的应用文件中（例如 `app.py` 或 `app.ts`）：

::: code-group

```python [Python]
from openai import OpenAI

def retriever(query: str):
    # 最小化示例检索器
    return ["Harrison worked at Kensho"]

# OpenAI 客户端调用（尚未包装）
client = OpenAI()

def rag(question: str) -> str:
    docs = retriever(question)
    system_message = (
        "Answer the user's question using only the provided information below:\n"
        + "\n".join(docs)
    )

    # 此调用尚未被追踪
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": question},
        ],
    )
    return resp.choices[0].message.content

if __name__ == "__main__":
    print(rag("Where did Harrison work?"))
```

```typescript [TypeScript]
import "dotenv/config";
import OpenAI from "openai";

// 最小化示例检索器
function retriever(query: string): string[] {
    return ["Harrison worked at Kensho"];
}

// OpenAI 客户端调用（尚未包装）
const client = new OpenAI();

async function rag(question: string) {
    const docs = retriever(question);
    const systemMessage =
        "Answer the user's question using only the provided information below:\n" +
        docs.join("\n");

    // 此调用尚未被追踪
    const resp = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: question },
        ],
    });

    return resp.choices[0].message?.content;
}

(async () => {
  console.log(await rag("Where did Harrison work?"));
})();
```

:::

## 4. 追踪 LLM 调用

首先，您将追踪所有 OpenAI 调用。LangSmith 提供了包装器：

- Python: [`wrap_openai`](https://docs.smith.langchain.com/reference/python/wrappers/langsmith.wrappers._openai.wrap_openai)
- TypeScript: [`wrapOpenAI`](https://docs.smith.langchain.com/reference/js/functions/wrappers_openai.wrapOpenAI)

此代码片段包装了 OpenAI 客户端，以便后续的每个模型调用都会自动作为追踪的子运行记录到 LangSmith 中。

1. 在您的应用文件中包含高亮显示的行：

::: code-group

```python Python highlight={2,7}
from openai import OpenAI
from langsmith.wrappers import wrap_openai  # 追踪 openai 调用

def retriever(query: str):
    return ["Harrison worked at Kensho"]

client = wrap_openai(OpenAI())  # 通过包装模型调用来记录追踪

def rag(question: str) -> str:
    docs = retriever(question)
    system_message = (
        "Answer the user's question using only the provided information below:\n"
        + "\n".join(docs)
    )
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": question},
        ],
    )
    return resp.choices[0].message.content

if __name__ == "__main__":
    print(rag("Where did Harrison work?"))
```

```typescript TypeScript highlight={3,9}
    import "dotenv/config";
    import OpenAI from "openai";
    import { wrapOpenAI } from "langsmith/wrappers"; // 追踪 openai 调用

    function retriever(query: string): string[] {
        return ["Harrison worked at Kensho"];
    }

const client = wrapOpenAI(new OpenAI()); // 通过包装模型调用来记录追踪信息

    async function rag(question: string) {
        const docs = retriever(question);
        const systemMessage =
            "仅使用下面提供的信息回答用户的问题：\n" +
            docs.join("\n");

        const resp = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: question },
            ],
        });

        return resp.choices[0].message?.content;
    }

    (async () => {
        console.log(await rag("Harrison 在哪里工作？"));
    })();
```

:::

1. 调用你的应用程序：

::: code-group

```bash [Python]
python app.py
```

```bash [TypeScript]
npx ts-node app.ts
```

:::

你将收到以下输出：

```
Harrison 在 Kensho 工作。
```

1. 在 [LangSmith UI](https://smith.langchain.com) 中，导航到你的工作区（或你在[步骤 2](#2-set-up-environment-variables) 中指定的工作区）的 **default** 追踪项目。你将看到刚刚被记录的 OpenAI 调用。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/trace-quickstart-llm-call.png" alt="LangSmith UI 界面显示一个名为 ChatOpenAI 的 LLM 调用追踪，包含系统输入、用户输入和 AI 输出。" />

<img src="/langsmith/images/trace-quickstart-llm-call-dark.png" alt="LangSmith UI 界面显示一个名为 ChatOpenAI 的 LLM 调用追踪，包含系统输入、用户输入和 AI 输出。" />

</div>

## 5. 追踪整个应用程序

你也可以使用 `traceable` 装饰器（适用于 [Python](https://docs.smith.langchain.com/reference/python/run_helpers/langsmith.run_helpers.traceable) 或 [TypeScript](https://langsmith-docs-bdk0fivr6-langchain.vercel.app/reference/js/functions/traceable.traceable)）来追踪你的整个应用程序，而不仅仅是 LLM 调用。

1. 在你的应用文件中包含高亮显示的代码：

::: code-group

```python Python highlight={3,10}
from openai import OpenAI
from langsmith.wrappers import wrap_openai
from langsmith import traceable

def retriever(query: str):
    return ["Harrison worked at Kensho"]

client = wrap_openai(OpenAI())  # 保留此项以捕获来自 LLM 的提示和响应

@traceable
def rag(question: str) -> str:
    docs = retriever(question)
    system_message = (
        "仅使用下面提供的信息回答用户的问题：\n"
        + "\n".join(docs)
    )
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": question},
        ],
    )
    return resp.choices[0].message.content

if __name__ == "__main__":
    print(rag("Where did Harrison work?"))
```

```typescript TypeScript highlight={3,11}
import "dotenv/config";
import OpenAI from "openai";
import { wrapOpenAI, traceable } from "langsmith/wrappers";

function retriever(query: string): string[] {
    return ["Harrison worked at Kensho"];
}

const client = wrapOpenAI(new OpenAI()); // 保留此项以捕获来自 LLM 的提示和响应

const rag = traceable(async (question: string) => {
    const docs = retriever(question);
    const systemMessage =
        "仅使用下面提供的信息回答用户的问题：\n" +
        docs.join("\n");

    const resp = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: question },
        ],
    });

    return resp.choices[0].message?.content;
});

(async () => {
    console.log(await rag("Where did Harrison work?"));
})();
```

:::

1. 再次调用应用程序以创建一个运行：

::: code-group

```bash [Python]
python app.py
```

```bash [TypeScript]
npx ts-node app.ts
```

:::

1. 返回 [LangSmith UI](https://smith.langchain.com)，导航到您工作区（或您在[步骤 2](#2-set-up-environment-variables) 中指定的工作区）的 **default** 追踪项目。您将找到整个应用管道的追踪记录，包括 **rag** 步骤和 **ChatOpenAI** LLM 调用。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/trace-quickstart-app.png" alt="LangSmith UI 显示名为 rag 的整个应用程序的追踪记录，包含输入和输出。" />

<img src="/langsmith/images/trace-quickstart-app-dark.png" alt="LangSmith UI 显示名为 rag 的整个应用程序的追踪记录，包含输入和输出。" />

</div>

## 后续步骤

以下是您接下来可能想要探索的一些主题：

- [追踪集成](/langsmith/trace-with-langchain) 为各种 LLM 提供商和智能体（agent）框架提供支持。
- [过滤追踪记录](/langsmith/filter-traces-in-application) 可以帮助您有效地导航和分析包含大量数据的追踪项目中的数据。
- [追踪 RAG 应用程序](/langsmith/observability-llm-tutorial) 是一个完整的教程，它为应用程序从开发到生产添加了可观测性。
- [将追踪记录发送到特定项目](/langsmith/log-traces-to-project) 可以更改追踪记录的目标项目。

<Callout type="info" icon="bird">

记录追踪记录后，使用 <strong>[Polly](/langsmith/polly)</strong> 对其进行分析，并获得关于应用程序性能的 AI 驱动洞察。

</Callout>

## 视频指南
<iframe
  className="w-full aspect-video rounded-xl"
  src="https://www.youtube.com/embed/fA9b4D8IsPQ?si=0eBb1vzw5AxUtplS"
  title="YouTube 视频播放器"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
