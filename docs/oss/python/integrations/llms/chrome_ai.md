---
title: ChromeAI
---

<Info>

<strong>此功能为</strong>实验性<strong>功能，可能会发生变化。</strong>

</Info>

<Note>

Google 的 `内置 AI 早期预览计划` 目前处于测试阶段。如需申请访问权限或了解更多信息，请访问[此链接](https://developer.chrome.com/docs/ai/built-in)。

</Note>

ChromeAI 利用 Gemini Nano 直接在浏览器或 [worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) 中运行 LLM，无需互联网连接。这使得模型运行更快、更私密，且数据无需离开用户设备。

## 快速开始

一旦您获得该计划的访问权限，请按照 Google 提供的说明下载模型。

下载完成后，您可以在浏览器中按如下方式开始使用 `ChromeAI`：

```typescript
import { ChromeAI } from "@langchain/community/experimental/llms/chrome_ai";

const model = new ChromeAI({
  temperature: 0.5, // 可选，默认为 0.5
  topK: 40, // 可选，默认为 40
});

const response = await model.invoke("Write me a short poem please");

/*
  In the realm where moonlight weaves its hue,
  Where dreams and secrets gently intertwine,
  There's a place of tranquility and grace,
  Where whispers of the night find their place.

  Beneath the canopy of starlit skies,
  Where dreams take flight and worries cease,
  A haven of tranquility, pure and true,
  Where the heart finds solace, finding dew.

  In this realm where dreams find their release,
  Where the soul finds peace, at every peace,
  Let us wander, lost in its embrace,
  Finding solace in this tranquil space.
*/
```

### 流式输出

`ChromeAI` 也支持流式输出：

```typescript
import { ChromeAI } from "@langchain/community/experimental/llms/chrome_ai";

const model = new ChromeAI({
  temperature: 0.5, // 可选，默认为 0.5
  topK: 40, // 可选，默认为 40
});

for await (const chunk of await model.stream("How are you?")) {
  console.log(chunk);
}

/*
  As
   an
   AI
   language
   model
  ,
   I
   don
  '
  t
   have
   personal
   experiences
   or
   the
   ability
   to
   experience
   emotions
  .
   Therefore
  ,
   I
   cannot
   directly
   answer
   the
   question
   "
  How
   are
   you
  ?".

  May
   I
   suggest
   answering
   something
   else
  ?
*/
```

## 相关链接

- [模型指南](/oss/python/langchain/models)
