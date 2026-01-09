---
title: Guardrails
description: 为您的智能体（agent）实施安全检查与内容过滤
---
防护栏（Guardrails）通过在智能体执行的关键节点验证和过滤内容，帮助您构建安全、合规的 AI 应用。它们可以检测敏感信息、强制执行内容策略、验证输出，并在问题发生前阻止不安全行为。

常见用例包括：
- 防止 PII（个人身份信息）泄露
- 检测并阻止提示注入攻击
- 阻止不当或有害内容
- 执行业务规则和合规要求
- 验证输出质量和准确性

您可以使用[中间件](/oss/langchain/middleware)在关键节点拦截执行，从而实施防护栏——例如在智能体启动前、完成后，或在模型调用和工具调用前后。

<img src="/oss/images/middleware_final.png" alt="中间件流程图" />

防护栏可以通过两种互补的方法实现：

<CardGroup :cols="2">

<Card title="确定性防护栏" icon="list-check">

使用基于规则的逻辑，如正则表达式模式、关键词匹配或显式检查。快速、可预测且成本效益高，但可能遗漏细微的违规行为。

</Card>

<Card title="基于模型的防护栏" icon="brain">

使用 LLM 或分类器通过语义理解来评估内容。能捕捉规则遗漏的微妙问题，但速度较慢且成本更高。

</Card>

</CardGroup>

LangChain 提供了内置的防护栏（例如 [PII 检测](#pii-detection)、[人工介入](#human-in-the-loop)）以及一个灵活的中间件系统，用于使用上述任一方法构建自定义防护栏。

## 内置防护栏

### PII 检测

LangChain 提供了内置的中间件，用于检测和处理对话中的个人身份信息（PII）。该中间件可以检测常见的 PII 类型，如电子邮件、信用卡、IP 地址等。

PII 检测中间件适用于以下场景：具有合规要求的医疗保健和金融应用、需要清理日志的客户服务代理，以及任何处理敏感用户数据的应用。

PII 中间件支持多种处理检测到的 PII 的策略：

| 策略 | 描述 | 示例 |
|----------|-------------|---------|
| `redact` | 替换为 `[REDACTED_{PII_TYPE}]` | `[REDACTED_EMAIL]` |
| `mask` | 部分遮蔽（例如，最后 4 位数字） | `****-****-****-1234` |
| `hash` | 替换为确定性哈希值 | `a8f5f167...` |
| `block` | 检测到时抛出异常 | 抛出错误 |

```typescript
import { createAgent, piiRedactionMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [customerServiceTool, emailTool],
  middleware: [
    // 在发送给模型之前，对用户输入中的电子邮件进行编辑
    piiRedactionMiddleware({
      piiType: "email",
      strategy: "redact",
      applyToInput: true,
    }),
    // 对用户输入中的信用卡进行掩码处理
    piiRedactionMiddleware({
      piiType: "credit_card",
      strategy: "mask",
      applyToInput: true,
    }),
    // 阻止 API 密钥 - 如果检测到则抛出错误
    piiRedactionMiddleware({
      piiType: "api_key",
      detector: /sk-[a-zA-Z0-9]{32}/,
      strategy: "block",
      applyToInput: true,
    }),
  ],
});

// 当用户提供 PII 时，将根据策略进行处理
const result = await agent.invoke({
  messages: [{
    role: "user",
    content: "My email is john.doe@example.com and card is 5105-1051-0510-5100"
  }]
});
```

:::: details 内置 PII 类型和配置

<strong>内置 PII 类型：</strong>
- `email` - 电子邮件地址
- `credit_card` - 信用卡号（经过 Luhn 算法验证）
- `ip` - IP 地址
- `mac_address` - MAC 地址
- `url` - URL

<strong>配置选项：</strong>

参数 | 描述 | 默认值
-----------|-------------|---------
`piiType` | 要检测的 PII 类型（内置或自定义） | 必需
`strategy` | 如何处理检测到的 PII (`"block"`, `"redact"`, `"mask"`, `"hash"`) | `"redact"`
`detector` | 自定义检测器正则表达式模式 | `undefined`（使用内置）
`applyToInput` | 在模型调用前检查用户消息 | `true`
`applyToOutput` | 在模型调用后检查 AI 消息 | `false`
`applyToToolResults` | 在执行后检查工具结果消息 | `false`

::::

有关 PII 检测功能的完整详细信息，请参阅[中间件文档](/oss/langchain/middleware#pii-detection)。

### 人工介入

LangChain 提供了内置的中间件，用于在执行敏感操作前要求人工批准。这是处理高风险决策最有效的防护栏之一。

人工介入中间件适用于以下场景：金融交易和转账、删除或修改生产数据、向外部发送通信，以及任何具有重大业务影响的操作。

```typescript
import { createAgent, humanInTheLoopMiddleware } from "langchain";
import { MemorySaver, Command } from "@langchain/langgraph";

const agent = createAgent({
  model: "gpt-4o",
  tools: [searchTool, sendEmailTool, deleteDatabaseTool],
  middleware: [
    humanInTheLoopMiddleware({
      interruptOn: {
        // 敏感操作需要批准
        send_email: { allowAccept: true, allowEdit: true, allowRespond: true },
        delete_database: { allowAccept: true, allowEdit: true, allowRespond: true },
        // 自动批准安全操作
        search: false,
      }
    }),
  ],
  checkpointer: new MemorySaver(),
});

// 人工介入需要一个线程 ID 来保持持久性
const config = { configurable: { thread_id: "some_id" } };

// 代理将在执行敏感工具前暂停并等待批准
let result = await agent.invoke(
  { messages: [{ role: "user", content: "Send an email to the team" }] },
  config
);

result = await agent.invoke(
  new Command({ resume: { decisions: [{ type: "approve" }] } }),
  config  // 相同的线程 ID 以恢复暂停的对话
);
```

<Tip>

有关实现审批工作流的完整详细信息，请参阅[人工介入文档](/oss/langchain/human-in-the-loop)。

</Tip>

## 自定义防护栏

对于更复杂的防护栏，您可以创建在智能体执行前后运行的自定义中间件。这使您可以完全控制验证逻辑、内容过滤和安全检查。

### 智能体执行前的防护栏

使用“智能体执行前”钩子在每次调用的开始时验证请求。这对于会话级别的检查非常有用，例如身份验证、速率限制，或在任何处理开始前阻止不当请求。

```typescript
import { createMiddleware, AIMessage } from "langchain";

const contentFilterMiddleware = (bannedKeywords: string[]) => {
  const keywords = bannedKeywords.map(kw => kw.toLowerCase());

  return createMiddleware({
    name: "ContentFilterMiddleware",
    beforeAgent: {
      hook: (state) => {
        // 获取第一条用户消息
        if (!state.messages || state.messages.length === 0) {
          return;
        }

        const firstMessage = state.messages[0];
        if (firstMessage._getType() !== "human") {
          return;
        }

        const content = firstMessage.content.toString().toLowerCase();

        // 检查禁用关键词
        for (const keyword of keywords) {
          if (content.includes(keyword)) {
            // 在任何处理前阻止执行
            return {
              messages: [
                new AIMessage(
                  "I cannot process requests containing inappropriate content. Please rephrase your request."
                )
              ],
              jumpTo: "end",
            };
          }
        }

        return;
      },
      canJumpTo: ['end']
    }
  });
};

// 使用自定义防护栏
import { createAgent } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [searchTool, calculatorTool],
  middleware: [
    contentFilterMiddleware(["hack", "exploit", "malware"]),
  ],
});

// 此请求将在任何处理前被阻止
const result = await agent.invoke({
  messages: [{ role: "user", content: "How do I hack into a database?" }]
});
```

### 智能体执行后的防护栏

使用“智能体执行后”钩子在返回给用户之前验证最终输出。这对于基于模型的安全检查、质量验证或对完整智能体响应的最终合规性扫描非常有用。

```typescript
import { createMiddleware, AIMessage, initChatModel } from "langchain";

const safetyGuardrailMiddleware = () => {
  const safetyModel = initChatModel("gpt-4o-mini");

  return createMiddleware({
    name: "SafetyGuardrailMiddleware",
    afterAgent: {
      hook: async (state) => {
        // 获取最终的 AI 响应
        if (!state.messages || state.messages.length === 0) {
          return;
        }

        const lastMessage = state.messages[state.messages.length - 1];
        if (lastMessage._getType() !== "ai") {
          return;
        }

        // 使用模型评估安全性
        const safetyPrompt = `Evaluate if this response is safe and appropriate.
        Respond with only 'SAFE' or 'UNSAFE'.

        Response: ${lastMessage.content.toString()}`;

        const result = await safetyModel.invoke([
          { role: "user", content: safetyPrompt }
        ]);

        if (result.content.toString().includes("UNSAFE")) {
          return {
            messages: [
              new AIMessage(
                "I cannot provide that response. Please rephrase your request."
              )
            ],
            jumpTo: "end",
          };
        }

        return;
      },
      canJumpTo: ['end']
    }
  });
};

// 使用安全防护栏
import { createAgent } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [searchTool, calculatorTool],
  middleware: [safetyGuardrailMiddleware()],
});

const result = await agent.invoke({
  messages: [{ role: "user", content: "How do I make explosives?" }]
});
```

### 组合多个防护栏 (Combine multiple guardrails)

您可以通过将多个防护栏添加到 middleware 数组来叠加使用它们。它们按顺序执行，允许您构建分层防护：

```typescript
import { createAgent, piiRedactionMiddleware, humanInTheLoopMiddleware } from "langchain";

const agent = createAgent({
  model: "gpt-4o",
  tools: [searchTool, sendEmailTool],
  middleware: [
    // 第 1 层：确定性输入过滤（在智能体执行前运行）
    contentFilterMiddleware(["hack", "exploit"]),

    // 第 2 层：PII 保护（在模型调用前后运行）
    piiRedactionMiddleware({
      piiType: "email",
      strategy: "redact",
      applyToInput: true,
    }),
    piiRedactionMiddleware({
      piiType: "email",
      strategy: "redact",
      applyToOutput: true,
    }),

    // 第 3 层：针对敏感工具的人工审批
    humanInTheLoopMiddleware({
      interruptOn: {
        send_email: { allowAccept: true, allowEdit: true, allowRespond: true },
      }
    }),

    // 第 4 层：基于模型的安全检查（在智能体执行后运行）
    safetyGuardrailMiddleware(),
  ],
});
```

## 额外资源 (Additional resources)

- [中间件文档 (Middleware documentation)](/oss/langchain/middleware) - 自定义中间件的完整指南
- [中间件 API 参考 (Middleware API reference)](https://reference.langchain.com/python/langchain/middleware/) - 详细的 API 说明
- [人工介入 (Human-in-the-loop)](/oss/langchain/human-in-the-loop) - 为敏感操作添加人工审核
- [测试智能体 (Testing agents)](/oss/langchain/test) - 安全机制的测试策略

