---
title: 工作流与智能体
sidebarTitle: Workflows + agents
---
本指南回顾了常见的工作流和智能体模式。

- 工作流具有预定的代码路径，设计为按特定顺序运行。
- 智能体是动态的，能够定义自己的流程和工具使用方式。

![智能体工作流](/oss/images/agent_workflow.png)

LangGraph 在构建智能体和工作流时提供了多项优势，包括[持久化](/oss/langgraph/persistence)、[流式处理](/oss/langgraph/streaming)、调试支持以及[部署](/oss/langgraph/deploy)。

## 设置

要构建工作流或智能体，您可以使用任何支持结构化输出和工具调用的[聊天模型](/oss/integrations/chat)。以下示例使用 Anthropic：

1. 安装依赖项

::: code-group

```bash [npm]
npm install @langchain/langgraph @langchain/core
```

```bash [pnpm]
pnpm add @langchain/langgraph @langchain/core
```

```bash [yarn]
yarn add @langchain/langgraph @langchain/core
```

```bash [bun]
bun add @langchain/langgraph @langchain/core
```

:::

2. 初始化 LLM：

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const llm = new ChatAnthropic({
  model: "claude-sonnet-4-5-20250929",
  apiKey: "<your_anthropic_key>"
});
```

## LLM 与增强功能

工作流和智能体系统基于 LLM 以及您为其添加的各种增强功能。[工具调用](/oss/langchain/tools)、[结构化输出](/oss/langchain/structured-output) 和[短期记忆](/oss/langchain/short-term-memory) 是几种根据需求定制 LLM 的选项。

![LLM 增强功能](/oss/images/augmented_llm.png)

```typescript

import * as z from "zod";
import { tool } from "langchain";

// Schema for structured output
const SearchQuery = z.object({
  search_query: z.string().describe("Query that is optimized web search."),
  justification: z
    .string()
    .describe("Why this query is relevant to the user's request."),
});

// Augment the LLM with schema for structured output
const structuredLlm = llm.withStructuredOutput(SearchQuery);

// Invoke the augmented LLM
const output = await structuredLlm.invoke(
  "How does Calcium CT score relate to high cholesterol?"
);

// Define a tool
const multiply = tool(
  ({ a, b }) => {
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

// Augment the LLM with tools
const llmWithTools = llm.bindTools([multiply]);

// Invoke the LLM with input that triggers the tool call
const msg = await llmWithTools.invoke("What is 2 times 3?");

// Get the tool call
console.log(msg.tool_calls);
```

## 提示链

提示链是指每个 LLM 调用处理前一个调用的输出。它通常用于执行可以分解为更小、可验证步骤的明确定义的任务。一些例子包括：

- 将文档翻译成不同语言
- 验证生成内容的一致性

![提示链](/oss/images/prompt_chain.png)

::: code-group

```typescript [Graph API]
import { StateGraph, Annotation } from "@langchain/langgraph";

// Graph state
const StateAnnotation = Annotation.Root({
  topic: Annotation<string>,
  joke: Annotation<string>,
  improvedJoke: Annotation<string>,
  finalJoke: Annotation<string>,
});

// Define node functions

// First LLM call to generate initial joke
async function generateJoke(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(`Write a short joke about ${state.topic}`);
  return { joke: msg.content };
}

// Gate function to check if the joke has a punchline
function checkPunchline(state: typeof StateAnnotation.State) {
  // Simple check - does the joke contain "?" or "!"
  if (state.joke?.includes("?") || state.joke?.includes("!")) {
    return "Pass";
  }
  return "Fail";
}

  // Second LLM call to improve the joke
async function improveJoke(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(
    `Make this joke funnier by adding wordplay: ${state.joke}`
  );
  return { improvedJoke: msg.content };
}

// Third LLM call for final polish
async function polishJoke(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(
    `Add a surprising twist to this joke: ${state.improvedJoke}`
  );
  return { finalJoke: msg.content };
}

// Build workflow
const chain = new StateGraph(StateAnnotation)
  .addNode("generateJoke", generateJoke)
  .addNode("improveJoke", improveJoke)
  .addNode("polishJoke", polishJoke)
  .addEdge("__start__", "generateJoke")
  .addConditionalEdges("generateJoke", checkPunchline, {
    Pass: "improveJoke",
    Fail: "__end__"
  })
  .addEdge("improveJoke", "polishJoke")
  .addEdge("polishJoke", "__end__")
  .compile();

// Invoke
const state = await chain.invoke({ topic: "cats" });
console.log("Initial joke:");
console.log(state.joke);
console.log("\n--- --- ---\n");
if (state.improvedJoke !== undefined) {
  console.log("Improved joke:");
  console.log(state.improvedJoke);
  console.log("\n--- --- ---\n");

  console.log("Final joke:");
  console.log(state.finalJoke);
} else {
  console.log("Joke failed quality gate - no punchline detected!");
}
```

```typescript [Functional API]
import { task, entrypoint } from "@langchain/langgraph";

// Tasks

// First LLM call to generate initial joke
const generateJoke = task("generateJoke", async (topic: string) => {
  const msg = await llm.invoke(`Write a short joke about ${topic}`);
  return msg.content;
});

// Gate function to check if the joke has a punchline
function checkPunchline(joke: string) {
  // Simple check - does the joke contain "?" or "!"
  if (joke.includes("?") || joke.includes("!")) {
    return "Pass";
  }
  return "Fail";
}

  // Second LLM call to improve the joke
const improveJoke = task("improveJoke", async (joke: string) => {
  const msg = await llm.invoke(
    `Make this joke funnier by adding wordplay: ${joke}`
  );
  return msg.content;
});

// Third LLM call for final polish
const polishJoke = task("polishJoke", async (joke: string) => {
  const msg = await llm.invoke(
    `Add a surprising twist to this joke: ${joke}`
  );
  return msg.content;
});

const workflow = entrypoint(
  "jokeMaker",
  async (topic: string) => {
    const originalJoke = await generateJoke(topic);
    if (checkPunchline(originalJoke) === "Pass") {
      return originalJoke;
    }
    const improvedJoke = await improveJoke(originalJoke);
    const polishedJoke = await polishJoke(improvedJoke);
    return polishedJoke;
  }
);

const stream = await workflow.stream("cats", {
  streamMode: "updates",
});

for await (const step of stream) {
  console.log(step);
}
```

:::

## 并行化

通过并行化，LLM 可以同时处理任务。这可以通过同时运行多个独立的子任务，或者多次运行同一任务以检查不同输出来实现。并行化通常用于：

- 拆分子任务并并行运行，以提高速度
- 多次运行任务以检查不同输出，以增加置信度

一些例子包括：

- 运行一个子任务处理文档中的关键词，同时运行第二个子任务检查格式错误
- 多次运行一个任务，根据不同的标准（如引用数量、使用的来源数量以及来源质量）对文档的准确性进行评分

![parallelization.png](/oss/images/parallelization.png)

::: code-group

```typescript [Graph API]
import { StateGraph, Annotation } from "@langchain/langgraph";

// Graph state
const StateAnnotation = Annotation.Root({
  topic: Annotation<string>,
  joke: Annotation<string>,
  story: Annotation<string>,
  poem: Annotation<string>,
  combinedOutput: Annotation<string>,
});

// Nodes
// First LLM call to generate initial joke
async function callLlm1(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(`Write a joke about ${state.topic}`);
  return { joke: msg.content };
}

// Second LLM call to generate story
async function callLlm2(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(`Write a story about ${state.topic}`);
  return { story: msg.content };
}

// Third LLM call to generate poem
async function callLlm3(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(`Write a poem about ${state.topic}`);
  return { poem: msg.content };
}

// Combine the joke, story and poem into a single output
async function aggregator(state: typeof StateAnnotation.State) {
  const combined = `Here's a story, joke, and poem about ${state.topic}!\n\n` +
    `STORY:\n${state.story}\n\n` +
    `JOKE:\n${state.joke}\n\n` +
    `POEM:\n${state.poem}`;
  return { combinedOutput: combined };
}

// Build workflow
const parallelWorkflow = new StateGraph(StateAnnotation)
  .addNode("callLlm1", callLlm1)
  .addNode("callLlm2", callLlm2)
  .addNode("callLlm3", callLlm3)
  .addNode("aggregator", aggregator)
  .addEdge("__start__", "callLlm1")
  .addEdge("__start__", "callLlm2")
  .addEdge("__start__", "callLlm3")
  .addEdge("callLlm1", "aggregator")
  .addEdge("callLlm2", "aggregator")
  .addEdge("callLlm3", "aggregator")
  .addEdge("aggregator", "__end__")
  .compile();

// Invoke
const result = await parallelWorkflow.invoke({ topic: "cats" });
console.log(result.combinedOutput);
```

```typescript [Functional API]
import { task, entrypoint } from "@langchain/langgraph";

// Tasks

// First LLM call to generate initial joke
const callLlm1 = task("generateJoke", async (topic: string) => {
  const msg = await llm.invoke(`Write a joke about ${topic}`);
  return msg.content;
});

// Second LLM call to generate story
const callLlm2 = task("generateStory", async (topic: string) => {
  const msg = await llm.invoke(`Write a story about ${topic}`);
  return msg.content;
});

// Third LLM call to generate poem
const callLlm3 = task("generatePoem", async (topic: string) => {
  const msg = await llm.invoke(`Write a poem about ${topic}`);
  return msg.content;
});

// Combine outputs
const aggregator = task("aggregator", async (params: {
  topic: string;
  joke: string;
  story: string;
  poem: string;
}) => {
  const { topic, joke, story, poem } = params;
  return `Here's a story, joke, and poem about ${topic}!\n\n` +
    `STORY:\n${story}\n\n` +
    `JOKE:\n${joke}\n\n` +
    `POEM:\n${poem}`;
});

// Build workflow
const workflow = entrypoint(
  "parallelWorkflow",
  async (topic: string) => {
    const [joke, story, poem] = await Promise.all([
      callLlm1(topic),
      callLlm2(topic),
      callLlm3(topic),
    ]);

    return aggregator({ topic, joke, story, poem });
  }
);

// Invoke
const stream = await workflow.stream("cats", {
  streamMode: "updates",
});

for await (const step of stream) {
  console.log(step);
}
```

:::

## 路由

路由工作流处理输入，然后将它们定向到特定上下文的任务。这允许您为复杂任务定义专门的流程。例如，一个用于回答产品相关问题的工作流可能会先处理问题类型，然后将请求路由到针对定价、退款、退货等的特定流程。

![routing.png](/oss/images/routing.png)

::: code-group

```typescript [Graph API]
import { StateGraph, Annotation } from "@langchain/langgraph";
import * as z from "zod";

// Schema for structured output to use as routing logic
const routeSchema = z.object({
  step: z.enum(["poem", "story", "joke"]).describe(
    "The next step in the routing process"
  ),
});

// Augment the LLM with schema for structured output
const router = llm.withStructuredOutput(routeSchema);

// Graph state
const StateAnnotation = Annotation.Root({
  input: Annotation<string>,
  decision: Annotation<string>,
  output: Annotation<string>,
});

// Nodes
// Write a story
async function llmCall1(state: typeof StateAnnotation.State) {
  const result = await llm.invoke([{
    role: "system",
    content: "You are an expert storyteller.",
  }, {
    role: "user",
    content: state.input
  }]);
  return { output: result.content };
}

// Write a joke
async function llmCall2(state: typeof StateAnnotation.State) {
  const result = await llm.invoke([{
    role: "system",
    content: "You are an expert comedian.",
  }, {
    role: "user",
    content: state.input
  }]);
  return { output: result.content };
}

// Write a poem
async function llmCall3(state: typeof StateAnnotation.State) {
  const result = await llm.invoke([{
    role: "system",
    content: "You are an expert poet.",
  }, {
    role: "user",
    content: state.input
  }]);
  return { output: result.content };
}

async function llmCallRouter(state: typeof StateAnnotation.State) {
  // Route the input to the appropriate node
  const decision = await router.invoke([
    {
      role: "system",
      content: "Route the input to story, joke, or poem based on the user's request."
    },
    {
      role: "user",
      content: state.input
    },
  ]);

  return { decision: decision.step };
}

// Conditional edge function to route to the appropriate node
function routeDecision(state: typeof StateAnnotation.State) {
  // Return the node name you want to visit next
  if (state.decision === "story") {
    return "llmCall1";
  } else if (state.decision === "joke") {
    return "llmCall2";
  } else if (state.decision === "poem") {
    return "llmCall3";
  }
}

// Build workflow
const routerWorkflow = new StateGraph(StateAnnotation)
  .addNode("llmCall1", llmCall1)
  .addNode("llmCall2", llmCall2)
  .addNode("llmCall3", llmCall3)
  .addNode("llmCallRouter", llmCallRouter)
  .addEdge("__start__", "llmCallRouter")
  .addConditionalEdges(
    "llmCallRouter",
    routeDecision,
    ["llmCall1", "llmCall2", "llmCall3"],
  )
  .addEdge("llmCall1", "__end__")
  .addEdge("llmCall2", "__end__")
  .addEdge("llmCall3", "__end__")
  .compile();

// Invoke
const state = await routerWorkflow.invoke({
  input: "Write me a joke about cats"
});
console.log(state.output);
```

```typescript [Functional API]
import * as z from "zod";
import { task, entrypoint } from "@langchain/langgraph";

// Schema for structured output to use as routing logic
const routeSchema = z.object({
  step: z.enum(["poem", "story", "joke"]).describe(
    "The next step in the routing process"
  ),
});

// Augment the LLM with schema for structured output
const router = llm.withStructuredOutput(routeSchema);

// Tasks
// Write a story
const llmCall1 = task("generateStory", async (input: string) => {
  const result = await llm.invoke([{
    role: "system",
    content: "You are an expert storyteller.",
  }, {
    role: "user",
    content: input
  }]);
  return result.content;
});

// Write a joke
const llmCall2 = task("generateJoke", async (input: string) => {
  const result = await llm.invoke([{
    role: "system",
    content: "You are an expert comedian.",
  }, {
    role: "user",
    content: input
  }]);
  return result.content;
});

// Write a poem
const llmCall3 = task("generatePoem", async (input: string) => {
  const result = await llm.invoke([{
    role: "system",
    content: "You are an expert poet.",
  }, {
    role: "user",
    content: input
  }]);
  return result.content;
});

// Route the input to the appropriate node
const llmCallRouter = task("router", async (input: string) => {
  const decision = await router.invoke([
    {
      role: "system",
      content: "Route the input to story, joke, or poem based on the user's request."
    },
    {
      role: "user",
      content: input
    },
  ]);
  return decision.step;
});

// Build workflow
const workflow = entrypoint(
  "routerWorkflow",
  async (input: string) => {
    const nextStep = await llmCallRouter(input);

    let llmCall;
    if (nextStep === "story") {
      llmCall = llmCall1;
    } else if (nextStep === "joke") {
      llmCall = llmCall2;
    } else if (nextStep === "poem") {
      llmCall = llmCall3;
    }

    const finalResult = await llmCall(input);
    return finalResult;
  }
);

// Invoke
const stream = await workflow.stream("Write me a joke about cats", {
  streamMode: "updates",
});

for await (const step of stream) {
  console.log(step);
}
```

:::

## 协调器-工作者

在协调器-工作者配置中，协调器：

- 将任务分解为子任务
- 将子任务委托给工作者
- 将工作者的输出合成为最终结果

![worker.png](/oss/images/worker.png)

协调器-工作者工作流提供了更大的灵活性，通常在子任务无法像[并行化](#parallelization)那样预定义时使用。这在需要编写代码或跨多个文件更新内容的工作流中很常见。例如，一个需要跨未知数量的文档更新多个 Python 库安装说明的工作流可能会使用这种模式。

::: code-group

```typescript [Graph API]

type SectionSchema = {
    name: string;
    description: string;
}
type SectionsSchema = {
    sections: SectionSchema[];
}

// Augment the LLM with schema for structured output
const planner = llm.withStructuredOutput(sectionsSchema);
```

```typescript [Functional API]
import * as z from "zod";
import { task, entrypoint } from "@langchain/langgraph";

// Schema for structured output to use in planning
const sectionSchema = z.object({
  name: z.string().describe("Name for this section of the report."),
  description: z.string().describe(
    "Brief overview of the main topics and concepts to be covered in this section."
  ),
});

const sectionsSchema = z.object({
  sections: z.array(sectionSchema).describe("Sections of the report."),
});

// Augment the LLM with schema for structured output
const planner = llm.withStructuredOutput(sectionsSchema);

// Tasks
const orchestrator = task("orchestrator", async (topic: string) => {
  // Generate queries
  const reportSections = await planner.invoke([
    { role: "system", content: "Generate a plan for the report." },
    { role: "user", content: `Here is the report topic: ${topic}` },
  ]);

  return reportSections.sections;
});

const llmCall = task("sectionWriter", async (section: z.infer<typeof sectionSchema>) => {
  // Generate section
  const result = await llm.invoke([
    {
      role: "system",
      content: "Write a report section.",
    },
    {
      role: "user",
      content: `Here is the section name: ${section.name} and description: ${section.description}`,
    },
  ]);

  return result.content;
});

const synthesizer = task("synthesizer", async (completedSections: string[]) => {
  // Synthesize full report from sections
  return completedSections.join("\n\n---\n\n");
});

// Build workflow
const workflow = entrypoint(
  "orchestratorWorker",
  async (topic: string) => {
    const sections = await orchestrator(topic);
    const completedSections = await Promise.all(
      sections.map((section) => llmCall(section))
    );
    return synthesizer(completedSections);
  }
);

// Invoke
const stream = await workflow.stream("Create a report on LLM scaling laws", {
  streamMode: "updates",
});

for await (const step of stream) {
  console.log(step);
}
```

:::

### 在 LangGraph 中创建工作者

协调器-工作者工作流很常见，LangGraph 内置了对它们的支持。`Send` API 允许您动态创建工作节点并向它们发送特定输入。每个工作者都有自己的状态，所有工作者的输出都写入一个共享状态键，协调器图可以访问该键。这使得协调器能够访问所有工作者的输出，并将它们合成为最终输出。下面的示例遍历一个章节列表，并使用 `Send` API 将每个章节发送给一个工作者。

```typescript
import { Annotation, StateGraph, Send } from "@langchain/langgraph";

// Graph state
const StateAnnotation = Annotation.Root({
  topic: Annotation<string>,
  sections: Annotation<SectionsSchema[]>,
  completedSections: Annotation<string[]>({
    default: () => [],
    reducer: (a, b) => a.concat(b),
  }),
  finalReport: Annotation<string>,
});

// Worker state
const WorkerStateAnnotation = Annotation.Root({
  section: Annotation<SectionsSchema>,
  completedSections: Annotation<string[]>({
    default: () => [],
    reducer: (a, b) => a.concat(b),
  }),
});

// Nodes
async function orchestrator(state: typeof StateAnnotation.State) {
  // Generate queries
  const reportSections = await planner.invoke([
    { role: "system", content: "Generate a plan for the report." },
    { role: "user", content: `Here is the report topic: ${state.topic}` },
  ]);

  return { sections: reportSections.sections };
}

async function llmCall(state: typeof WorkerStateAnnotation.State) {
  // Generate section
  const section = await llm.invoke([
    {
      role: "system",
      content: "Write a report section following the provided name and description. Include no preamble for each section. Use markdown formatting.",
    },
    {
      role: "user",
      content: `Here is the section name: ${state.section.name} and description: ${state.section.description}`,
    },
  ]);

  // Write the updated section to completed sections
  return { completedSections: [section.content] };
}

async function synthesizer(state: typeof StateAnnotation.State) {
  // List of completed sections
  const completedSections = state.completedSections;

  // Format completed section to str to use as context for final sections
  const completedReportSections = completedSections.join("\n\n---\n\n");

  return { finalReport: completedReportSections };
}

// Conditional edge function to create llm_call workers that each write a section of the report
function assignWorkers(state: typeof StateAnnotation.State) {
  // Kick off section writing in parallel via Send() API
  return state.sections.map((section) =>
    new Send("llmCall", { section })
  );
}

// Build workflow
const orchestratorWorker = new StateGraph(StateAnnotation)
  .addNode("orchestrator", orchestrator)
  .addNode("llmCall", llmCall)
  .addNode("synthesizer", synthesizer)
  .addEdge("__start__", "orchestrator")
  .addConditionalEdges(
    "orchestrator",
    assignWorkers,
    ["llmCall"]
  )
  .addEdge("llmCall", "synthesizer")
  .addEdge("synthesizer", "__end__")
  .compile();

// Invoke
const state = await orchestratorWorker.invoke({
  topic: "Create a report on LLM scaling laws"
});
console.log(state.finalReport);
```

## 评估器-优化器

在评估器-优化器工作流中，一个 LLM 调用创建响应，另一个 LLM 调用评估该响应。如果评估器或[人工介入](/oss/langgraph/interrupts)确定响应需要改进，则会提供反馈并重新创建响应。此循环持续进行，直到生成可接受的响应。

评估器-优化器工作流通常在任务有特定的成功标准，但需要迭代才能满足该标准时使用。例如，在两种语言之间翻译文本时，并不总是有完美的匹配。可能需要几次迭代才能生成在两种语言中含义相同的翻译。

![evaluator_optimizer.png](/oss/images/evaluator_optimizer.png)

::: code-group

```typescript [Graph API]
import * as z from "zod";
import { Annotation, StateGraph } from "@langchain/langgraph";

// Graph state
const StateAnnotation = Annotation.Root({
  joke: Annotation<string>,
  topic: Annotation<string>,
  feedback: Annotation<string>,
  funnyOrNot: Annotation<string>,
});

// Schema for structured output to use in evaluation
const feedbackSchema = z.object({
  grade: z.enum(["funny", "not funny"]).describe(
    "Decide if the joke is funny or not."
  ),
  feedback: z.string().describe(
    "If the joke is not funny, provide feedback on how to improve it."
  ),
});

// Augment the LLM with schema for structured output
const evaluator = llm.withStructuredOutput(feedbackSchema);

// Nodes
async function llmCallGenerator(state: typeof StateAnnotation.State) {
  // LLM generates a joke
  let msg;
  if (state.feedback) {
    msg = await llm.invoke(
      `Write a joke about ${state.topic} but take into account the feedback: ${state.feedback}`
    );
  } else {
    msg = await llm.invoke(`Write a joke about ${state.topic}`);
  }
  return { joke: msg.content };
}

async function llmCallEvaluator(state: typeof StateAnnotation.State) {
  // LLM evaluates the joke
  const grade = await evaluator.invoke(`Grade the joke ${state.joke}`);
  return { funnyOrNot: grade.grade, feedback: grade.feedback };
}

// Conditional edge function to route back to joke generator or end based upon feedback from the evaluator
function routeJoke(state: typeof StateAnnotation.State) {
  // Route back to joke generator or end based upon feedback from the evaluator
  if (state.funnyOrNot === "funny") {
    return "Accepted";
  } else if (state.funnyOrNot === "not funny") {
    return "Rejected + Feedback";
  }
}

// Build workflow
const optimizerWorkflow = new StateGraph(StateAnnotation)
  .addNode("llmCallGenerator", llmCallGenerator)
  .addNode("llmCallEvaluator", llmCallEvaluator)
  .addEdge("__start__", "llmCallGenerator")
  .addEdge("llmCallGenerator", "llmCallEvaluator")
  .addConditionalEdges(
    "llmCallEvaluator",
    routeJoke,
    {
      // Name returned by routeJoke : Name of next node to visit
      "Accepted": "__end__",
      "Rejected + Feedback": "llmCallGenerator",
    }
  )
  .compile();

// Invoke
const state = await optimizerWorkflow.invoke({ topic: "Cats" });
console.log(state.joke);
```

```typescript [Functional API]
import * as z from "zod";
import { task, entrypoint } from "@langchain/langgraph";

// Schema for structured output to use in evaluation
const feedbackSchema = z.object({
  grade: z.enum(["funny", "not funny"]).describe(
    "Decide if the joke is funny or not."
  ),
  feedback: z.string().describe(
    "If the joke is not funny, provide feedback on how to improve it."
  ),
});

// Augment the LLM with schema for structured output
const evaluator = llm.withStructuredOutput(feedbackSchema);

// Tasks
const llmCallGenerator = task("jokeGenerator", async (params: {
  topic: string;
  feedback?: z.infer<typeof feedbackSchema>;
}) => {
  // LLM generates a joke
  const msg = params.feedback
    ? await llm.invoke(
        `Write a joke about ${params.topic} but take into account the feedback: ${params.feedback.feedback}`
      )
    : await llm.invoke(`Write a joke about ${params.topic}`);
  return msg.content;
});

const llmCallEvaluator = task("jokeEvaluator", async (joke: string) => {
  // LLM evaluates the joke
  return evaluator.invoke(`Grade the joke ${joke}`);
});

// Build workflow
const workflow = entrypoint(
  "optimizerWorkflow",
  async (topic: string) => {
    let feedback: z.infer<typeof feedbackSchema> | undefined;
    let joke: string;

    while (true) {
      joke = await llmCallGenerator({ topic, feedback });
      feedback = await llmCallEvaluator(joke);

      if (feedback.grade === "funny") {
        break;
      }
    }

    return joke;
  }
);

// Invoke
const stream = await workflow.stream("Cats", {
  streamMode: "updates",
});

for await (const step of stream) {
  console.log(step);
  console.log("\n");
}
```

:::

## 智能体

智能体通常实现为使用[工具](/oss/langchain/tools)执行操作的 LLM。它们在连续的反馈循环中运行，用于问题和解决方案不可预测的情况。智能体比工作流具有更多的自主权，可以决定使用哪些工具以及如何解决问题。您仍然可以定义可用的工具集和智能体行为的指导原则。

![agent.png](/oss/images/agent.png)

<Note>

要开始使用智能体，请参阅[快速入门](/oss/langchain/quickstart)或在 LangChain 中了解更多关于[它们的工作原理](/oss/langchain/agents)。

</Note>

```typescript [Using tools]
import { tool } from "@langchain/core/tools";
import * as z from "zod";

// Define tools
const multiply = tool(
  ({ a, b }) => {
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers together",
    schema: z.object({
      a: z.number().describe("first number"),
      b: z.number().describe("second number"),
    }),
  }
);

const add = tool(
  ({ a, b }) => {
    return a + b;
  },
  {
    name: "add",
    description: "Add two numbers together",
    schema: z.object({
      a: z.number().describe("first number"),
      b: z.number().describe("second number"),
    }),
  }
);

const divide = tool(
  ({ a, b }) => {
    return a / b;
  },
  {
    name: "divide",
    description: "Divide two numbers",
    schema: z.object({
      a: z.number().describe("first number"),
      b: z.number().describe("second number"),
    }),
  }
);

// Augment the LLM with tools
const tools = [add, multiply, divide];
const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
const llmWithTools = llm.bindTools(tools);
```

::: code-group

```typescript [Graph API]
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import {
  SystemMessage,
  ToolMessage
} from "@langchain/core/messages";

// Nodes
async function llmCall(state: typeof MessagesAnnotation.State) {
  // LLM decides whether to call a tool or not
  const result = await llmWithTools.invoke([
    {
      role: "system",
      content: "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
    },
    ...state.messages
  ]);

  return {
    messages: [result]
  };
}

const toolNode = new ToolNode(tools);

// Conditional edge function to route to the tool node or end
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages.at(-1);

  // If the LLM makes a tool call, then perform an action
  if (lastMessage?.tool_calls?.length) {
    return "toolNode";
  }
  // Otherwise, we stop (reply to the user)
  return "__end__";
}

// Build workflow
const agentBuilder = new StateGraph(MessagesAnnotation)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  // Add edges to connect nodes
  .addEdge("__start__", "llmCall")
  .addConditionalEdges(
    "llmCall",
    shouldContinue,
    ["toolNode", "__end__"]
  )
  .addEdge("toolNode", "llmCall")
  .compile();

// Invoke
const messages = [{
  role: "user",
  content: "Add 3 and 4."
}];
const result = await agentBuilder.invoke({ messages });
console.log(result.messages);
```

```typescript [Functional API]
import { task, entrypoint, addMessages } from "@langchain/langgraph";
import { BaseMessageLike, ToolCall } from "@langchain/core/messages";

const callLlm = task("llmCall", async (messages: BaseMessageLike[]) => {
  // LLM decides whether to call a tool or not
  return llmWithTools.invoke([
    {
      role: "system",
      content: "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
    },
    ...messages
  ]);
});

const callTool = task("toolCall", async (toolCall: ToolCall) => {
  // Performs the tool call
  const tool = toolsByName[toolCall.name];
  return tool.invoke(toolCall.args);
});

const agent = entrypoint(
  "agent",
  async (messages) => {
    let llmResponse = await callLlm(messages);

    while (true) {
      if (!llmResponse.tool_calls?.length) {
        break;
      }

      // Execute tools
      const toolResults = await Promise.all(
        llmResponse.tool_calls.map((toolCall) => callTool(toolCall))
      );

      messages = addMessages(messages, [llmResponse, ...toolResults]);
      llmResponse = await callLlm(messages);
    }

    messages = addMessages(messages, [llmResponse]);
    return messages;
  }
);

// Invoke
const messages = [{
  role: "user",
  content: "Add 3 and 4."
}];

const stream = await agent.stream([messages], {
  streamMode: "updates",
});

for await (const step of stream) {
  console.log(step);
}
```

:::

