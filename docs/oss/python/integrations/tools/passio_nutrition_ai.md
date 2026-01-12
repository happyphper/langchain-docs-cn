---
title: Passio NutritionAI
---
为了更好地理解 NutritionAI 如何赋予您的智能体超强的食物营养分析能力，让我们构建一个能够通过 Passio NutritionAI 查找相关信息的智能体。

## 定义工具

我们首先需要创建 [Passio NutritionAI 工具](/oss/python/integrations/tools/passio_nutrition_ai)。

### [Passio Nutrition AI](/oss/python/integrations/tools/passio_nutrition_ai)

LangChain 内置了一个工具，可以轻松使用 Passio NutritionAI 来查找食物营养成分信息。
请注意，这需要一个 API 密钥——他们提供免费套餐。

创建 API 密钥后，您需要将其导出为：

```bash
export NUTRITIONAI_SUBSCRIPTION_KEY="..."
```

... 或者通过其他方式（例如 `dotenv` 包）将其提供给您的 Python 环境。您也可以通过构造函数调用显式控制密钥。

```python
from dotenv import load_dotenv
from langchain_core.utils import get_from_env

load_dotenv()

nutritionai_subscription_key = get_from_env(
    "nutritionai_subscription_key", "NUTRITIONAI_SUBSCRIPTION_KEY"
)
```

```python
from langchain_community.tools.passio_nutrition_ai import NutritionAI
from langchain_community.utilities.passio_nutrition_ai import NutritionAIAPI
```

```python
nutritionai_search = NutritionAI(api_wrapper=NutritionAIAPI())
```

```python
nutritionai_search.invoke("chicken tikka masala")
```

```python
nutritionai_search.invoke("Schnuck Markets sliced pepper jack cheese")
```

### 工具

现在我们有了工具，可以创建一个将在后续使用的工具列表。

```python
tools = [nutritionai_search]
```

## 创建智能体

定义好工具后，我们现在可以创建智能体。我们将使用 OpenAI Functions 智能体——有关此类智能体以及其他选项的更多信息，请参阅[本指南](/oss/python/langchain/agents)。

首先，我们选择用于指导智能体的 LLM。

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
```

接下来，我们选择用于指导智能体的提示词。

```python
from langchain_classic import hub

# 获取要使用的提示词 - 您可以修改它！
prompt = hub.pull("hwchase17/openai-functions-agent")
prompt.messages
```

```text
[SystemMessagePromptTemplate(prompt=PromptTemplate(input_variables=[], template='You are a helpful assistant')),
 MessagesPlaceholder(variable_name='chat_history', optional=True),
 HumanMessagePromptTemplate(prompt=PromptTemplate(input_variables=['input'], template='{input}')),
 MessagesPlaceholder(variable_name='agent_scratchpad')]
```

现在，我们可以使用 LLM、提示词和工具来初始化智能体。智能体负责接收输入并决定采取什么行动。至关重要的是，智能体本身不执行这些操作——这由 AgentExecutor（下一步）完成。有关如何理解这些组件的更多信息，请参阅我们的[概念指南](/oss/python/langchain/agents)。

```python
from langchain.agents import create_openai_functions_agent

agent = create_openai_functions_agent(llm, tools, prompt)
```

最后，我们将智能体（大脑）与工具组合在 AgentExecutor 中（它将重复调用智能体并执行工具）。有关如何理解这些组件的更多信息，请参阅我们的[概念指南](/oss/python/langchain/agents)。

```python
from langchain.agents import AgentExecutor

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
```

## 运行智能体

我们现在可以在几个查询上运行智能体了！请注意，目前这些都是**无状态**查询（它不会记住之前的交互）。

```python
agent_executor.invoke({"input": "hi!"})
```

```text
> Entering new AgentExecutor chain...
Hello! How can I assist you today?

> Finished chain.
```

```python
{'input': 'hi!', 'output': 'Hello! How can I assist you today?'}
```

```python
agent_executor.invoke({"input": "how many calories are in a slice pepperoni pizza?"})
```

如果我们想自动跟踪这些消息，可以将其包装在 RunnableWithMessageHistory 中。

```python
agent_executor.invoke(
    {"input": "I had bacon and eggs for breakfast.  How many calories is that?"}
)
```

```python
agent_executor.invoke(
    {
        "input": "I had sliced pepper jack cheese for a snack.  How much protein did I have?"
    }
)
```

```python
agent_executor.invoke(
    {
        "input": "I had sliced colby cheese for a snack. Give me calories for this Schnuck Markets product."
    }
)
```

```python
agent_executor.invoke(
    {
        "input": "I had chicken tikka masala for dinner.  how much calories, protein, and fat did I have with default quantity?"
    }
)
```

## 结论

到此结束！在这个快速入门中，我们介绍了如何创建一个能够将食物营养信息融入其答案的简单智能体。智能体是一个复杂的主题，还有很多东西需要学习！
