---
title: 提示工程快速入门
sidebarTitle: Quickstart
---

提示词（Prompts）指导着大语言模型（LLM）的行为。[_提示工程_](/langsmith/prompt-engineering-concepts) 是指精心设计、测试和完善你提供给 LLM 的指令，使其产生可靠且有用的响应的过程。

LangSmith 提供了用于创建、版本控制、测试和协作处理提示词的工具。你还会遇到一些常见概念，例如 [_提示词模板_](/langsmith/prompt-engineering-concepts#prompts-vs-prompt-templates)，它允许你复用结构化的提示词；以及 [_变量_](/langsmith/prompt-engineering-concepts#f-string-vs-mustache)，它允许你将值（例如用户的问题）动态插入到提示词中。

在本快速入门中，你将使用 UI 或 SDK 来创建、测试和改进提示词。本快速入门将使用 OpenAI 作为示例 LLM 提供商，但相同的工作流程适用于其他提供商。

<Tip>

如果你更喜欢观看关于提示工程入门的视频，请参考快速入门的 [视频指南](#video-guide)。

</Tip>

## 先决条件

开始之前，请确保你具备：

- **一个 LangSmith 账户**：在 [smith.langchain.com](https://smith.langchain.com) 注册或登录。
- **一个 LangSmith API 密钥**：请遵循 [创建 API 密钥](/langsmith/create-account-api-key#create-an-api-key) 指南。
- **一个 OpenAI API 密钥**：从 [OpenAI 控制台](https://platform.openai.com/account/api-keys) 生成。

选择 UI 或 SDK 工作流程的标签页：

<Tabs>

<Tab title="UI" icon="window">

## 1. 设置工作区密钥

<!--@include: @/snippets/python/langsmith/set-workspace-secrets.md-->

## 2. 创建提示词

1.  在 [LangSmith UI](https://smith.langchain.com) 中，导航到左侧菜单的 **Prompts** 部分。
2.  点击 **+ Prompt** 来创建一个提示词。
3.  根据需要编辑或添加提示词和输入变量来修改提示词。

<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/create-a-prompt-light.png" alt="Prompt playground with the system prompt ready for editing." />

<img src="/langsmith/images/create-a-prompt-dark.png" alt="Prompt playground with the system prompt ready for editing." />

</div>

## 3. 测试提示词

1.  在 **Prompts** 标题下，选择模型名称旁边的齿轮 <Icon icon="gear" iconType="solid" /> 图标，这将在 **Model Configuration** 标签页中启动 **Prompt Settings** 窗口。
2.  设置你想要使用的 [模型配置](/langsmith/managing-model-configurations)。你选择的 **Provider** 和 **Model** 将决定此配置页面上可配置的参数。设置完成后，点击 **Save as**。

    
<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/model-config-light.png" alt="Model Configuration window in the LangSmith UI, settings for Provider, Model, Temperature, Max Output Tokens, Top P, Presence Penalty, Frequency Penalty, Reasoning Effort, etc." />

<img src="/langsmith/images/model-config-dark.png" alt="Model Configuration window in the LangSmith UI, settings for Provider, Model, Temperature, Max Output Tokens, Top P, Presence Penalty, Frequency Penalty, Reasoning Effort, etc." />

</div>

3.  在 **Inputs** 框中指定你想要测试的输入变量，然后点击 <Icon icon="circle-play" iconType="solid" /> **Start**。

    
<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/set-input-start-light.png" alt="The input box with a question entered. The output box contains the response to the prompt." />

<img src="/langsmith/images/set-input-start-dark.png" alt="The input box with a question entered. The output box contains the response to the prompt." />

</div>

要了解在 Playground 中配置提示词的更多选项，请参考 [配置提示词设置](/langsmith/managing-model-configurations)。

4.  测试并完善你的提示词后，点击 **Save** 将其存储以备将来使用。

## 4. 迭代提示词

LangSmith 支持基于团队的提示词迭代。[工作区](/langsmith/administration-overview#workspaces) 成员可以在 Playground 中试验提示词，并在准备好时将他们的更改保存为新的 [_提交_](/langsmith/prompt-engineering-concepts#commits)。

要改进你的提示词：

-   参考你的模型提供商提供的文档，了解创建提示词的最佳实践，例如：
    -   [OpenAI API 提示工程最佳实践](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)
    -   [Gemini 提示设计简介](https://ai.google.dev/gemini-api/docs/prompting-intro)
-   使用 Prompt Canvas（LangSmith 中的一个交互式工具）来构建和完善你的提示词。在 [Prompt Canvas 指南](/langsmith/write-prompt-with-ai) 中了解更多信息。
-   标记特定的提交，以在你的提交历史中标记重要时刻。
    1.  要创建提交，请导航到 **Playground** 并选择 **Commit**。选择要提交更改的提示词，然后点击 **Commit**。
    2.  导航到左侧菜单中的 **Prompts**。选择提示词。进入提示词详情页面后，切换到 **Commits** 标签页。找到标签图标 <Icon icon="tag" iconType="solid" /> 以 **Add a Commit Tag**。

    
<div :style="{ textAlign: 'center' }">

<img src="/langsmith/images/add-commit-tag-light.png" alt="The tag, the commit tag box with the commit label, and the commit tag name box to create the tag." />

<img src="/langsmith/images/add-commit-tag-dark.png" alt="The tag, the commit tag box with the commit label, and the commit tag name box to create the tag." />

</div>

</Tab>

<Tab title="SDK" icon="code">

## 1. 设置你的环境

1.  在你的终端中，准备你的环境：

::: code-group

```bash [Python]
mkdir ls-prompt-quickstart && cd ls-prompt-quickstart
python -m venv .venv
source .venv/bin/activate
pip install -qU langsmith openai langchain_core
```

```bash [TypeScript]
mkdir ls-prompt-quickstart-ts && cd ls-prompt-quickstart-ts
npm init -y
npm install langsmith openai typescript ts-node
npx tsc --init
```

:::

2.  设置你的 API 密钥：

```bash
export LANGSMITH_API_KEY='<your_api_key>'
export OPENAI_API_KEY='<your_api_key>'
```

## 2. 创建提示词

要创建提示词，你需要定义提示词中所需的消息列表，然后推送到 LangSmith。

使用特定语言的构造函数和推送方法：

-   Python: <a href="https://reference.langchain.com/python/langchain_core/prompts/#langchain_core.prompts.chat.ChatPromptTemplate" target="_blank" rel="noreferrer" class="link"><code>ChatPromptTemplate</code></a> → [`client.push_prompt(...)`](https://docs.smith.langchain.com/reference/python/client/langsmith.client.Client#langsmith.client.Client.push_prompt)
-   TypeScript: [`ChatPromptTemplate.fromMessages(...)`](https://v03.api.js.langchain.com/classes/_langchain_core.prompts.ChatPromptTemplate.html#fromMessages) → [`client.pushPrompt(...)`](https://langsmith-docs-7jgx2bq8f-langchain.vercel.app/reference/js/classes/client.Client#pushprompt)

1.  将以下代码添加到 `create_prompt` 文件中：

::: code-group

```python [Python]
from langsmith import Client
from langchain_core.prompts import ChatPromptTemplate

client = Client()

prompt = ChatPromptTemplate([
    ("system", "You are a helpful chatbot."),
    ("user", "{question}"),
])

client.push_prompt("prompt-quickstart", object=prompt)
```

```typescript [TypeScript]
import { Client } from "langsmith";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const client = new Client();

const prompt = ChatPromptTemplate.fromMessages([
["system", "You are a helpful chatbot."],
["user", "{question}"],
]);

await client.pushPrompt("prompt-quickstart", {
object: prompt,
});
```

:::

这将创建一个有序的消息列表，将它们包装在 `ChatPromptTemplate` 中，然后按名称将提示词推送到你的 [工作区](/langsmith/administration-overview#workspaces) 以进行版本控制和复用。

2.  运行 `create_prompt`：

::: code-group

```python [Python]
python create_prompt.py
```

```typescript [TypeScript]
npx tsx create_prompt.ts
```

:::

按照生成的链接在 LangSmith UI 中查看新创建的 Prompt Hub 提示词。

## 3. 测试提示词

在此步骤中，你将通过名称（`"prompt-quickstart"`）拉取在 [步骤 2](#2-create-a-prompt) 中创建的提示词，使用测试输入格式化它，将其转换为 OpenAI 的聊天格式，并调用 OpenAI Chat Completions API。

然后，你将通过创建新版本迭代提示词。你工作区的成员可以打开现有提示词，在 [UI](https://smith.langchain.com) 中试验更改，并将这些更改保存为同一提示词的新提交，从而为整个团队保留历史记录。

1.  将以下内容添加到 `test_prompt` 文件中：

::: code-group

```python [Python]
from langsmith import Client
from openai import OpenAI
from langchain_core.messages import convert_to_openai_messages

client = Client()
oai_client = OpenAI()

prompt = client.pull_prompt("prompt-quickstart")

# Since the prompt only has one variable you could also pass in the value directly
# Equivalent to formatted_prompt = prompt.invoke("What is the color of the sky?")
formatted_prompt = prompt.invoke({"question": "What is the color of the sky?"})

response = oai_client.chat.completions.create(
    model="gpt-4o",
    messages=convert_to_openai_messages(formatted_prompt.messages),
)
```

```typescript [TypeScript]
import { OpenAI } from "openai";
import { pull } from "langchain/hub"
import { convertPromptToOpenAI } from "@langchain/openai";

const oaiClient = new OpenAI();

const prompt = await pull("prompt-quickstart");

// Format the prompt with the question
const formattedPrompt = await prompt.invoke({ question: "What is the color of the sky?" });

const response = await oaiClient.chat.completions.create({
    model: "gpt-4o",
    messages: convertPromptToOpenAI(formattedPrompt).messages,
});
```

:::

这使用 `pull` 按名称加载你正在测试的提示词的最新提交版本。你也可以通过传递提交哈希 `"<prompt-name>:<commit-hash>"` 来指定特定的提交。

2.  运行 `test_prompt`：

::: code-group

```python [Python]
python test_prompt.py
```

```typescript [TypeScript]
npx tsx test_prompt.ts
```

:::

3.  要创建提示词的新版本，请使用最初使用的相同推送方法，使用相同的提示词名称和你更新后的模板进行调用。LangSmith 会将其记录为新提交并保留先前版本。

将以下代码复制到 `iterate_prompt` 文件中：

::: code-group

```python [Python]
from langsmith import Client
from langchain_core.prompts import ChatPromptTemplate

client = Client()

new_prompt = ChatPromptTemplate([
    ("system", "You are a helpful chatbot. Respond in Spanish."),
    ("user", "{question}"),
])

client.push_prompt("prompt-quickstart", object=new_prompt)
```

```typescript [TypeScript]
import { Client } from "langsmith";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const client = new Client();

const newPrompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful chatbot. Speak in Spanish."],
    ["user", "{question}"]
]);

await client.pushPrompt("prompt-quickstart", {
    object: newPrompt
});
```

:::

4.  运行 `iterate_prompt`：

::: code-group

```python [Python]
python iterate_prompt.py
```

```typescript [TypeScript]
npx tsx iterate_prompt.ts
```

:::

现在你的提示词将包含两个提交。

要改进你的提示词：

-   参考你的模型提供商提供的文档，了解创建提示词的最佳实践，例如：
    -   [OpenAI API 提示工程最佳实践](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)
    -   [Gemini 提示设计简介](https://ai.google.dev/gemini-api/docs/prompting-intro)
-   使用 Prompt Canvas（LangSmith 中的一个交互式工具）来构建和完善你的提示词。在 [Prompt Canvas 指南](/langsmith/write-prompt-with-ai) 中了解更多信息。

</Tab>

</Tabs>

## 后续步骤

-   在 [创建提示词指南](/langsmith/create-a-prompt) 中了解更多关于如何使用 Prompt Hub 存储和管理提示词的信息。
-   在本教程中学习如何设置 Playground 以 [测试多轮对话](/langsmith/multiple-messages)。
-   学习如何针对数据集而不是单个示例测试提示词的性能，请参考 [从 Prompt Playground 运行评估](/langsmith/run-evaluation-from-prompt-playground)。

<Callout type="info" icon="bird">

在 Playground 中使用 <strong>[Polly](/langsmith/polly)</strong> 来帮助优化你的提示词、生成工具和创建输出模式。

</Callout>

## 视频指南
<iframe
  className="w-full aspect-video rounded-xl"
  src="https://www.youtube.com/embed/h4f6bIWGkog?si=IVJFfhldC7M3HL4G"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
