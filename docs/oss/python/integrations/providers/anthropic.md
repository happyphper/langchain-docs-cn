---
title: 概述
---
所有与 Anthropic 模型相关的功能。

[Anthropic](https://www.anthropic.com/) 是一家 AI 安全与研究公司，也是 Claude 的创造者。
本页涵盖了 Anthropic 模型与 LangChain 之间的所有集成。

## 提示词最佳实践

与 OpenAI 模型相比，Anthropic 模型有几项提示词最佳实践。

**系统消息可能只能是第一条消息**

Anthropic 模型要求任何系统消息必须是提示词中的第一条。

## `ChatAnthropic`

`ChatAnthropic` 是 LangChain `ChatModel` 的子类，这意味着它与 `ChatPromptTemplate` 配合使用效果最佳。
您可以使用以下代码导入此包装器：

<Tip>

有关安装 LangChain 包的通用说明，请参阅[此部分](/oss/langchain/install)。

</Tip>

```bash [npm]
npm install @langchain/anthropic @langchain/core
```

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
const model = new ChatAnthropic({});
```

在使用 ChatModels 时，建议您将提示词设计为 `ChatPromptTemplate`。
下面是一个示例：

```typescript
import { ChatPromptTemplate } from "@langchain/classic/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful chatbot"],
  ["human", "Tell me a joke about {topic}"],
]);
```

然后，您可以在链中使用它，如下所示：

```typescript
const chain = prompt.pipe(model);
await chain.invoke({ topic: "bears" });
```

更多示例，包括多模态输入，请参阅[聊天模型集成页面](/oss/integrations/chat/anthropic/)。
