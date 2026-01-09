---
title: 测试
---
智能体应用让大语言模型（LLM）自行决定解决问题的后续步骤。这种灵活性很强大，但模型的黑盒特性使得难以预测对智能体某一部分的调整会如何影响其他部分。要构建可用于生产环境的智能体，彻底的测试至关重要。

测试智能体有几种方法：

- 单元测试使用内存中的模拟对象，独立地测试智能体中小的、确定性的部分，以便快速、确定地断言其确切行为。

- [集成测试](#integration-testing) 通过真实的网络调用来测试智能体，以确认组件能协同工作、凭据和模式匹配、以及延迟是可接受的。

智能体应用往往更依赖集成测试，因为它们将多个组件链接在一起，并且必须处理由于 LLM 的非确定性特性而导致的不可靠性。

## 集成测试

许多智能体行为只有在使用真实的 LLM 时才会显现，例如智能体决定调用哪个工具、如何格式化响应，或者提示词的修改是否会影响整个执行轨迹。LangChain 的 [`agentevals`](https://github.com/langchain-ai/agentevals) 包提供了专门设计用于使用实时模型测试智能体轨迹的评估器。

AgentEvals 允许你通过执行 **轨迹匹配** 或使用 **LLM 评判** 来轻松评估智能体的轨迹（消息的确切序列，包括工具调用）：

<Card title="轨迹匹配" icon="equals" arrow="true" href="#trajectory-match-evaluator">

为给定输入硬编码一个参考轨迹，并通过逐步比较来验证运行。

适用于测试明确定义的工作流，其中你了解预期行为。当你对应该调用哪些工具以及调用顺序有特定期望时使用。这种方法具有确定性、快速且成本效益高，因为它不需要额外的 LLM 调用。

</Card>

<Card title="LLM 作为评判者" icon="gavel" arrow="true" href="#llm-as-judge-evaluator">

使用 LLM 来定性验证智能体的执行轨迹。"评判者" LLM 根据提示词标准（可以包含参考轨迹）来审查智能体的决策。

更灵活，可以评估效率和适当性等细微方面，但需要 LLM 调用且确定性较低。当你想评估智能体轨迹的整体质量和合理性，而没有严格的工具调用或顺序要求时使用。

</Card>

### 安装 AgentEvals

```bash
npm install agentevals @langchain/core
```

或者，直接克隆 [AgentEvals 仓库](https://github.com/langchain-ai/agentevals)。

### 轨迹匹配评估器

AgentEvals 提供了 `createTrajectoryMatchEvaluator` 函数来将智能体的轨迹与参考轨迹进行匹配。有四种模式可供选择：

| 模式 | 描述 | 使用场景 |
|------|-------------|----------|
| `strict` | 消息和工具调用顺序完全匹配 | 测试特定序列（例如，在授权之前进行策略查找） |
| `unordered` | 允许相同的工具调用以任意顺序出现 | 验证信息检索，当顺序无关紧要时 |
| `subset` | 智能体仅调用参考轨迹中的工具（不允许额外调用） | 确保智能体不超过预期范围 |
| `superset` | 智能体至少调用参考轨迹中的工具（允许额外调用） | 验证至少执行了所需的最小操作 |

:::: details 严格匹配

`strict` 模式确保轨迹包含相同顺序的相同消息和相同的工具调用，但允许消息内容存在差异。当你需要强制执行特定的操作序列时，这很有用，例如要求在授权操作之前进行策略查找。

```ts
import { createAgent, tool, HumanMessage, AIMessage, ToolMessage } from "langchain"
import { createTrajectoryMatchEvaluator } from "agentevals";
import * as z from "zod";

const getWeather = tool(
  async ({ city }: { city: string }) => {
    return `It's 75 degrees and sunny in ${city}.`;
  },
  {
    name: "get_weather",
    description: "Get weather information for a city.",
    schema: z.object({
      city: z.string(),
    }),
  }
);

const agent = createAgent({
  model: "gpt-4o",
  tools: [getWeather]
});

const evaluator = createTrajectoryMatchEvaluator({  // [!code highlight]
  trajectoryMatchMode: "strict",  // [!code highlight]
});  // [!code highlight]

async function testWeatherToolCalledStrict() {
  const result = await agent.invoke({
    messages: [new HumanMessage("What's the weather in San Francisco?")]
  });

  const referenceTrajectory = [
    new HumanMessage("What's the weather in San Francisco?"),
    new AIMessage({
      content: "",
      tool_calls: [
        { id: "call_1", name: "get_weather", args: { city: "San Francisco" } }
      ]
    }),
    new ToolMessage({
      content: "It's 75 degrees and sunny in San Francisco.",
      tool_call_id: "call_1"
    }),
    new AIMessage("The weather in San Francisco is 75 degrees and sunny."),
  ];

  const evaluation = await evaluator({
    outputs: result.messages,
    referenceOutputs: referenceTrajectory
  });
  // {
  //     'key': 'trajectory_strict_match',
  //     'score': true,
  //     'comment': null,
  // }
  expect(evaluation.score).toBe(true);
}
```

::::

:::: details 无序匹配

`unordered` 模式允许相同的工具调用以任意顺序出现，当你想要验证是否检索了特定信息但不关心顺序时，这很有帮助。例如，智能体可能需要检查城市的天气和活动，但顺序无关紧要。

```ts
import { createAgent, tool, HumanMessage, AIMessage, ToolMessage } from "langchain"
import { createTrajectoryMatchEvaluator } from "agentevals";
import * as z from "zod";

const getWeather = tool(
  async ({ city }: { city: string }) => {
    return `It's 75 degrees and sunny in ${city}.`;
  },
  {
    name: "get_weather",
    description: "Get weather information for a city.",
    schema: z.object({ city: z.string() }),
  }
);

const getEvents = tool(
  async ({ city }: { city: string }) => {
    return `Concert at the park in ${city} tonight.`;
  },
  {
    name: "get_events",
    description: "Get events happening in a city.",
    schema: z.object({ city: z.string() }),
  }
);

const agent = createAgent({
  model: "gpt-4o",
  tools: [getWeather, getEvents]
});

const evaluator = createTrajectoryMatchEvaluator({  // [!code highlight]
  trajectoryMatchMode: "unordered",  // [!code highlight]
});  // [!code highlight]

async function testMultipleToolsAnyOrder() {
  const result = await agent.invoke({
    messages: [new HumanMessage("What's happening in SF today?")]
  });

  // 参考轨迹显示工具调用顺序与实际执行不同
  const referenceTrajectory = [
    new HumanMessage("What's happening in SF today?"),
    new AIMessage({
      content: "",
      tool_calls: [
        { id: "call_1", name: "get_events", args: { city: "SF" } },
        { id: "call_2", name: "get_weather", args: { city: "SF" } },
      ]
    }),
    new ToolMessage({
      content: "Concert at the park in SF tonight.",
      tool_call_id: "call_1"
    }),
    new ToolMessage({
      content: "It's 75 degrees and sunny in SF.",
      tool_call_id: "call_2"
    }),
    new AIMessage("Today in SF: 75 degrees and sunny with a concert at the park tonight."),
  ];

  const evaluation = await evaluator({
    outputs: result.messages,
    referenceOutputs: referenceTrajectory,
  });
  // {
  //     'key': 'trajectory_unordered_match',
  //     'score': true,
  // }
  expect(evaluation.score).toBe(true);
}
```

::::

`superset` 和 `subset` 模式匹配部分轨迹。`superset` 模式验证智能体至少调用了参考轨迹中的工具，允许额外的工具调用。`subset` 模式确保智能体没有调用超出参考轨迹范围的任何工具。

:::js

```ts

const getWeather = tool(
  async ({ city }: { city: string }) => {
return `It's 75 degrees and sunny in ${city}.`;
  },
  {
name: "get_weather",
description: "Get weather information for a city.",
schema: z.object({ city: z.string() }),
  }
);

const getDetailedForecast = tool(
  async ({ city }: { city: string }) => {
return `Detailed forecast for ${city}: sunny all week.`;
  },
  {
name: "get_detailed_forecast",
description: "Get detailed weather forecast for a city.",
schema: z.object({ city: z.string() }),
  }
);

const agent = createAgent({
  model: "gpt-4o",
  tools: [getWeather, getDetailedForecast]
});

const evaluator = createTrajectoryMatchEvaluator({  // [!code highlight]
  trajectoryMatchMode: "superset",  // [!code highlight]
});  // [!code highlight]

async function testAgentCallsRequiredToolsPlusExtra() {
  const result = await agent.invoke({
messages: [new HumanMessage("What's the weather in Boston?")]
  });

  // 参考轨迹仅要求 getWeather，但智能体可能调用额外的工具
  const referenceTrajectory = [
new HumanMessage("What's the weather in Boston?"),
new AIMessage({
content: "",
tool_calls: [
{ id: "call_1", name: "get_weather", args: { city: "Boston" } },
]
}),
new ToolMessage({
content: "It's 
