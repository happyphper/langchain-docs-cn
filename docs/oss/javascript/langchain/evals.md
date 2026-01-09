---
title: 评估智能体性能
---
要评估你的智能体（agent）性能，你可以使用 `LangSmith` 的[评估功能](https://docs.langchain.com/langsmith/evaluation)。首先，你需要定义一个评估函数来评判智能体的结果，例如最终输出或执行轨迹（trajectory）。根据你的评估技术，这可能涉及也可能不涉及参考输出：

```typescript
type EvaluatorParams = {
    outputs: Record<string, any>;
    referenceOutputs: Record<string, any>;
};

function evaluator({ outputs, referenceOutputs }: EvaluatorParams) {
    // compare agent outputs against reference outputs
    const outputMessages = outputs.messages;
    const referenceMessages = referenceOutputs.messages;
    const score = compareMessages(outputMessages, referenceMessages);
    return { key: "evaluator_score", score: score };
}
```

要开始使用，你可以使用 `AgentEvals` 包中预置的评估器：

```bash
npm install agentevals
```

## 创建评估器

评估智能体性能的一种常见方法是将其执行轨迹（调用工具的顺序）与参考轨迹进行比较：

```typescript
import { createTrajectoryMatchEvaluator } from "agentevals/trajectory/match";

const outputs = [
    {
        role: "assistant",
        tool_calls: [
        {
            function: {
            name: "get_weather",
            arguments: JSON.stringify({ city: "san francisco" }),
            },
        },
        {
            function: {
            name: "get_directions",
            arguments: JSON.stringify({ destination: "presidio" }),
            },
        },
        ],
    },
];

const referenceOutputs = [
    {
        role: "assistant",
        tool_calls: [
        {
            function: {
            name: "get_weather",
            arguments: JSON.stringify({ city: "san francisco" }),
            },
        },
        ],
    },
];

// Create the evaluator
const evaluator = createTrajectoryMatchEvaluator({
  // Specify how the trajectories will be compared. `superset` will accept output trajectory as valid if it's a superset of the reference one. Other options include: strict, unordered and subset
  trajectoryMatchMode: "superset", // [!code highlight]
});

// Run the evaluator
const result = evaluator({
    outputs: outputs,
    referenceOutputs: referenceOutputs,
});
```

1.  指定轨迹的比较方式。`superset` 模式会接受输出轨迹，只要它是参考轨迹的超集。其他选项包括：[strict](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#strict-match)、[unordered](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#unordered-match) 和 [subset](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#subset-and-superset-match)。

作为下一步，了解更多关于如何[自定义轨迹匹配评估器](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#agent-trajectory-match)的信息。

### LLM 作为评判者

你可以使用 LLM 作为评判者的评估器，它利用一个 LLM 来将轨迹与参考输出进行比较并给出分数：

```typescript
import {
    createTrajectoryLlmAsJudge,
    TRAJECTORY_ACCURACY_PROMPT_WITH_REFERENCE,
} from "agentevals/trajectory/llm";

const evaluator = createTrajectoryLlmAsJudge({
    prompt: TRAJECTORY_ACCURACY_PROMPT_WITH_REFERENCE,
    model: "openai:o3-mini",
});
```

## 运行评估器

要运行评估器，你首先需要创建一个 [LangSmith 数据集](https://docs.langchain.com/langsmith/evaluation#datasets)。要使用预置的 AgentEvals 评估器，你需要一个符合以下模式的数据集：

*   **input**: `{"messages": [...]}` 调用智能体时使用的输入消息。
*   **output**: `{"messages": [...]}` 智能体输出中预期的消息历史记录。对于轨迹评估，你可以选择只保留助手（assistant）消息。

```typescript
import { Client } from "langsmith";
import { createAgent } from "langchain";
import { createTrajectoryMatchEvaluator } from "agentevals/trajectory/match";

const client = new Client();
const agent = createAgent({...});
const evaluator = createTrajectoryMatchEvaluator({...});

const experimentResults = await client.evaluate(
    (inputs) => agent.invoke(inputs),
    // replace with your dataset name
    { data: "<Name of your dataset>" },
    { evaluators: [evaluator] }
);
```

