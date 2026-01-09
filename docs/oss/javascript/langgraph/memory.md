---
title: 内存概览
---
[记忆](/oss/langgraph/add-memory) 是一个能记住先前交互信息的系统。对于 AI 智能体而言，记忆至关重要，因为它能让智能体记住之前的交互、从反馈中学习并适应用户偏好。随着智能体处理更复杂的任务和大量的用户交互，这种能力对于效率和用户满意度都变得至关重要。

本概念指南根据其回忆范围，涵盖两种类型的记忆：

*   **[短期记忆](#短期记忆)**，或称 **[线程](/oss/langgraph/persistence#threads)** 范围记忆，通过维护会话内的消息历史来跟踪正在进行的对话。LangGraph 将短期记忆作为智能体 **[状态](/oss/langgraph/graph-api#state)** 的一部分进行管理。状态通过 **[检查点](/oss/langgraph/persistence#checkpoints)** 持久化到数据库中，因此线程可以在任何时候恢复。短期记忆在图被调用或步骤完成时更新，并且在每个步骤开始时读取状态。
*   **[长期记忆](#长期记忆)** 跨会话存储用户特定或应用级别的数据，并在对话线程之间共享。它可以在任何时间、任何线程中被回忆。记忆的作用域可以是任何自定义的命名空间，而不仅仅局限于单个线程 ID。LangGraph 提供了 **[存储](/oss/langgraph/persistence#memory-store)** ([参考文档](https://langchain-ai.github.io/langgraph/reference/store/#langgraph.store.base.BaseStore)) 来让你保存和回忆长期记忆。

![短期 vs 长期](/oss/images/short-vs-long.png)

## 短期记忆

[短期记忆](/oss/langgraph/add-memory#add-short-term-memory) 让你的应用程序能够记住单个 **[线程](/oss/langgraph/persistence#threads)** 或对话内的先前交互。一个 **[线程](/oss/langgraph/persistence#threads)** 组织会话中的多次交互，类似于电子邮件将消息分组到单个对话中的方式。

LangGraph 将短期记忆作为智能体状态的一部分进行管理，通过线程范围的检查点进行持久化。这个状态通常可以包括对话历史以及其他有状态的数据，例如上传的文件、检索到的文档或生成的工件。通过将这些存储在图的**状态**中，机器人可以访问给定对话的完整上下文，同时保持不同线程之间的分离。

### 管理短期记忆

对话历史是短期记忆最常见的形式，而长对话对当今的 LLM 构成了挑战。完整的历史记录可能无法放入 LLM 的上下文窗口，导致不可恢复的错误。即使你的 LLM 支持完整的上下文长度，大多数 LLM 在长上下文上的表现仍然不佳。它们会被过时或离题的内容“分散注意力”，同时还会遭受响应时间变慢和成本更高的困扰。

聊天模型使用消息来接受上下文，这些消息包括开发者提供的指令（系统消息）和用户输入（人类消息）。在聊天应用中，消息在人类输入和模型响应之间交替，导致消息列表随着时间的推移而变长。由于上下文窗口有限且包含大量令牌的消息列表成本高昂，许多应用可以通过使用技术手动删除或遗忘过时信息而受益。

![过滤](/oss/images/filter.png)

有关管理消息的常用技术的更多信息，请参阅 [添加和管理记忆](/oss/langgraph/add-memory#manage-short-term-memory) 指南。

## 长期记忆

LangGraph 中的 **[长期记忆](/oss/langgraph/add-memory#add-long-term-memory)** 允许系统在不同的对话或会话之间保留信息。与**线程范围**的短期记忆不同，长期记忆保存在自定义的“命名空间”中。

长期记忆是一个复杂的挑战，没有一刀切的解决方案。然而，以下问题提供了一个框架来帮助你了解不同的技术：

*   **记忆的类型是什么？** 人类使用记忆来记住事实（[语义记忆](#语义记忆)）、经历（[情景记忆](#情景记忆)）和规则（[程序性记忆](#程序性记忆)）。AI 智能体可以以同样的方式使用记忆。例如，AI 智能体可以使用记忆来记住关于用户的特定事实以完成任务。
*   **[你希望何时更新记忆？](#写入记忆)** 记忆可以作为智能体应用逻辑的一部分进行更新（例如，“在热路径上”）。在这种情况下，智能体通常在响应用户之前决定记住事实。或者，记忆可以作为后台任务进行更新（在后台/异步运行并生成记忆的逻辑）。我们在下面的[章节](#写入记忆)中解释了这些方法之间的权衡。

不同的应用需要不同类型的记忆。虽然这个类比并不完美，但研究[人类记忆类型](https://www.psychologytoday.com/us/basics/memory/types-of-memory?ref=blog.langchain.dev)可以带来启发。一些研究（例如，[CoALA 论文](https://arxiv.org/pdf/2309.02427)）甚至将这些人类记忆类型映射到 AI 智能体中使用的类型。

| 记忆类型 | 存储内容 | 人类示例 | 智能体示例 |
| :--- | :--- | :--- | :--- |
| **[语义](#语义记忆)** | 事实 | 我在学校学到的东西 | 关于用户的事实 |
| **[情景](#情景记忆)** | 经历 | 我做过的事情 | 过去的智能体操作 |
| **[程序性](#程序性记忆)** | 指令 | 本能或运动技能 | 智能体系统提示词 |

### 语义记忆

[语义记忆](https://en.wikipedia.org/wiki/Semantic_memory)，无论是在人类还是 AI 智能体中，都涉及特定事实和概念的保留。在人类中，它可以包括在学校学到的信息以及对概念及其关系的理解。对于 AI 智能体，语义记忆通常用于通过记住过去交互中的事实或概念来个性化应用。

<Note>

语义记忆不同于“语义搜索”，后者是一种使用“含义”（通常作为嵌入向量）查找相似内容的技术。语义记忆是一个心理学术语，指的是存储事实和知识，而语义搜索是一种基于含义而非精确匹配来检索信息的方法。

</Note>

#### 配置文件

语义记忆可以通过不同的方式管理。例如，记忆可以是一个单一的、持续更新的“配置文件”，包含关于用户、组织或其他实体（包括智能体本身）的、范围明确且具体的信息。配置文件通常只是一个 JSON 文档，包含你选择用来表示领域的各种键值对。

当记住一个配置文件时，你需要确保每次都在**更新**配置文件。因此，你需要传入之前的配置文件，并[要求模型生成一个新的配置文件](https://github.com/langchain-ai/memory-template)（或一些要应用到旧配置文件的 [JSON 补丁](https://github.com/hinthornw/trustcall)）。随着配置文件变大，这可能会变得容易出错，并且可能受益于将配置文件拆分为多个文档，或者在生成文档时进行**严格**解码，以确保记忆模式保持有效。

![更新配置文件](/oss/images/update-profile.png)

#### 集合

或者，记忆可以是一个文档集合，这些文档随着时间的推移不断更新和扩展。每个单独的记忆可以范围更窄，更容易生成，这意味着你不太可能随着时间的推移**丢失**信息。对于 LLM 来说，为新信息生成*新的*对象比将新信息与现有配置文件协调起来更容易。因此，文档集合往往会导致[下游更高的召回率](https://en.wikipedia.org/wiki/Precision_and_recall)。

然而，这会将一些复杂性转移到记忆更新上。模型现在必须*删除*或*更新*列表中的现有项目，这可能很棘手。此外，一些模型可能默认过度插入，而另一些可能默认过度更新。请参阅 [Trustcall](https://github.com/hinthornw/trustcall) 包以了解一种管理方法，并考虑进行评估（例如，使用像 [LangSmith](https://docs.langchain.com/langsmith/evaluate-chatbot-tutorial#evaluate-a-chatbot) 这样的工具）来帮助你调整行为。

使用文档集合也会将复杂性转移到对列表的记忆**搜索**上。`Store` 目前同时支持 [语义搜索](https://langchain-ai.github.io/langgraph/reference/store/#langgraph.store.base.SearchOp.query) 和 [按内容过滤](https://langchain-ai.github.io/langgraph/reference/store/#langgraph.store.base.SearchOp.filter)。

最后，使用记忆集合可能使向模型提供全面的上下文变得具有挑战性。虽然单个记忆可能遵循特定的模式，但这种结构可能无法捕捉记忆之间的完整上下文或关系。因此，当使用这些记忆生成响应时，模型可能缺乏重要的上下文信息，而这些信息在统一的配置文件方法中更容易获得。

![更新列表](/oss/images/update-list.png)

无论采用哪种记忆管理方法，核心要点是智能体将使用语义记忆来 **[支撑其响应](https://python.langchain.com/docs/concepts/rag/)**，这通常会导致更个性化和相关的交互。

### 情景记忆

[情景记忆](https://en.wikipedia.org/wiki/Episodic_memory)，无论是在人类还是 AI 智能体中，都涉及回忆过去的事件或行为。[CoALA 论文](https://arxiv.org/pdf/2309.02427)很好地阐述了这一点：事实可以写入语义记忆，而*经历*可以写入情景记忆。对于 AI 智能体，情景记忆通常用于帮助智能体记住如何完成任务。

在实践中，情景记忆通常通过少样本示例提示来实现，智能体从过去的序列中学习以正确执行任务。有时“展示”比“讲述”更容易，LLM 从示例中学习效果很好。少样本学习让你可以通过在提示词中添加输入-输出示例来说明预期行为，从而[“编程”](https://x.com/karpathy/status/1627366413840322562)你的 LLM。虽然可以使用各种最佳实践来生成少样本示例，但挑战往往在于根据用户输入选择最相关的示例。

请注意，记忆 **[存储](/oss/langgraph/persistence#memory-store)** 只是将数据存储为少样本示例的一种方式。如果你希望有更多的开发者参与，或者将少样本示例与你的评估工具更紧密地结合，你也可以使用 LangSmith 数据集来存储你的数据。然后，开箱即用的动态少样本示例选择器可以用来实现相同的目标。LangSmith 将为你索引数据集，并能够基于关键词相似度检索与用户输入最相关的少样本示例。

请观看此操作指南 [视频](https://www.youtube.com/watch?v=37VaU7e7t5o)，了解在 LangSmith 中使用动态少样本示例选择的示例。此外，请参阅这篇 [博客文章](https://blog.langchain.dev/few-shot-prompting-to-improve-tool-calling-performance/)，展示了使用少样本提示来提高工具调用性能，以及这篇 [博客文章](https://blog.langchain.dev/aligning-llm-as-a-judge-with-human-preferences/)，使用少样本示例来使 LLM 与人类偏好对齐。

### 程序性记忆

[程序性记忆](https://en.wikipedia.org/wiki/Procedural_memory)，无论是在人类还是 AI 智能体中，都涉及记住用于执行任务的规则。在人类中，程序性记忆类似于如何执行任务的内化知识，例如通过基本运动技能和平衡来骑自行车。另一方面，情景记忆涉及回忆特定的经历，例如你第一次在没有辅助轮的情况下成功骑自行车，或者一次穿越风景优美的难忘骑行。对于 AI 智能体，程序性记忆是模型权重、智能体代码和智能体提示词的组合，共同决定了智能体的功能。

在实践中，智能体修改其模型权重或重写其代码的情况相当少见。然而，智能体修改自己的提示词则更为常见。

改进智能体指令的一种有效方法是通过 **[“反思”](https://blog.langchain.dev/reflection-agents/)** 或元提示。这包括向智能体提供其当前指令（例如，系统提示词）以及最近的对话或明确的用户反馈。然后，智能体根据此输入改进自己的指令。这种方法对于难以预先指定指令的任务特别有用，因为它允许智能体从其交互中学习和适应。

例如，我们构建了一个 [推文生成器](https://www.youtube.com/watch?v=Vn8A3BxfplE)，使用外部反馈和提示词重写来为 Twitter 生成高质量的论文摘要。在这种情况下，具体的摘要提示词很难*先验地*指定，但用户很容易批评生成的推文，并就如何改进摘要过程提供反馈。

下面的伪代码展示了如何使用 LangGraph 记忆 **[存储](/oss/langgraph/persistence#memory-store)** 来实现这一点，使用存储来保存提示词，`update_instructions` 节点获取当前提示词（以及从与用户的对话中捕获的反馈，保存在 `state["messages"]` 中），更新提示词，并将新提示词保存回存储。然后，`call_model` 从存储中获取更新后的提示词并使用它来生成响应。

```typescript
// 使用指令的节点
const callModel = async (state: State, store: BaseStore) => {
    const namespace = ["agent_instructions"];
    const instructions = await store.get(namespace, "agent_a");
    // 应用逻辑
    const prompt = promptTemplate.format({
        instructions: instructions[0].value.instructions
    });
    // ...
};

// 更新指令的节点
const updateInstructions = async (state: State, store: BaseStore) => {
    const namespace = ["instructions"];
    const currentInstructions = await store.search(namespace);
    // 记忆逻辑
    const prompt = promptTemplate.format({
        instructions: currentInstructions[0].value.instructions,
        conversation: state.messages
    });
    const output = await llm.invoke(prompt);
    const newInstructions = output.new_instructions;
    await store.put(["agent_instructions"], "agent_a", {
        instructions: newInstructions
    });
    // ...
};
```

![更新指令](/oss/images/update-instructions.png)

### 写入记忆

智能体写入记忆主要有两种方法：**[“在热路径上”](#在热路径上)** 和 **[“在后台”](#在后台)**。

![热路径 vs 后台](/oss/images/hot_path_vs_background.png)

#### 在热路径上

在运行时创建记忆既有优点也有挑战。积极的一面是，这种方法允许实时更新，使新记忆立即可用于后续交互。它还支持透明度，因为可以在创建和存储记忆时通知用户。

然而，这种方法也带来了挑战。如果智能体需要一个新的工具来决定将什么提交到记忆中，它可能会增加复杂性。此外，推理要保存什么到记忆的过程可能会影响智能体的延迟。最后，智能体必须在记忆创建和其他职责之间进行多任务处理，这可能会影响所创建记忆的数量和质量。

例如，ChatGPT 使用一个 [save_memories](https://openai.com/index/memory-and-new-controls-for-chatgpt/) 工具来以内容字符串的形式更新插入记忆，并决定是否以及如何使用这个工具来处理每条用户消息。请参阅我们的 [memory-agent](https://github.com/langchain-ai/memory-agent) 模板作为参考实现。

#### 在后台

作为单独的后台任务创建记忆有几个优点。它消除了主应用中的延迟，将应用逻辑与记忆管理分开，并允许智能体更专注地完成任务。这种方法还提供了在时间安排上的灵活性，以避免重复工作。

然而，这种方法也有其自身的挑战。确定记忆写入的频率变得至关重要，因为更新不频繁可能会使其他线程没有新的上下文。决定何时触发记忆形成也很重要。常见的策略包括：在一段时间后安排（如果发生新事件则重新安排）、使用 cron 计划，或允许用户或应用逻辑手动触发。

请参阅我们的 [memory-service](https://github.com/langchain-ai/memory-template) 模板作为参考实现。

### 记忆存储

LangGraph 将长期记忆作为 JSON 文档存储在 **[存储](/oss/langgraph/persistence#memory-store)** 中。每个记忆都组织在一个自定义的 `namespace`（类似于文件夹）和一个唯一的 `key`（类似于文件名）下。命名空间通常包括用户或组织 ID 或其他标签，以便更容易地组织信息。这种结构支持记忆的层次化组织。然后通过内容过滤器支持跨命名空间的搜索。

:::python

```python
from langgraph.store.memory import InMemoryStore

def embed(texts: list[str]) -> list[list[float]]:
    # 替换为实际的嵌入函数或 LangChain embeddings 对象
return [[1.0, 2.0] * len(texts)]

# InMemoryStore 将数据保存到内存字典中。在生产环境中使用数据库支持的存储。
store = InMemoryStore(index={"embed": embed, "dims": 2})
user_id = "my-user"
application_context = "
