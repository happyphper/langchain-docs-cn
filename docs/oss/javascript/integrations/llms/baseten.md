---
title: Baseten
---
[Baseten](https://baseten.co) 是 LangChain 生态系统中的一个 [Provider](/oss/integrations/providers/baseten)，它实现了 LLMs 组件。

本示例演示了如何在 LangChain 中使用一个 LLM —— 托管在 Baseten 上的 Mistral 7B。

# 设置

要运行此示例，你需要：

* 一个 [Baseten 账户](https://baseten.co)
* 一个 [API 密钥](https://docs.baseten.co/observability/api-keys)

将你的 API 密钥导出为名为 `BASETEN_API_KEY` 的环境变量。

```sh
export BASETEN_API_KEY="paste_your_api_key_here"
```

# 单次模型调用

首先，你需要在 Baseten 上部署一个模型。

你可以从 [Baseten 模型库](https://app.baseten.co/explore/) 一键部署像 Mistral 和 Llama 2 这样的基础模型，或者如果你有自己的模型，可以 [使用 Truss 部署它](https://truss.baseten.co/welcome)。

在本示例中，我们将使用 Mistral 7B。[在此部署 Mistral 7B](https://app.baseten.co/explore/mistral_7b_instruct) 并记下模型仪表板中找到的已部署模型的 ID。

```python
## 安装使用该集成所需的 langchain 包
pip install -qU langchain-community
```

```python
from langchain_community.llms import Baseten
```

```python
# 加载模型
mistral = Baseten(model="MODEL_ID", deployment="production")
```

```python
# 向模型提问
mistral("What is the Mistral wind?")
```

# 链式模型调用

我们可以将对一个或多个模型的多次调用链接在一起，这正是 LangChain 的核心所在！

例如，我们可以在这个终端模拟演示中用 Mistral 替换 GPT。

```python
from langchain_classic.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain_core.prompts import PromptTemplate

template = """Assistant is a large language model trained by OpenAI.

Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

Assistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, Assistant is a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.

{history}
Human: {human_input}
Assistant:"""

prompt = PromptTemplate(input_variables=["history", "human_input"], template=template)

chatgpt_chain = LLMChain(
    llm=mistral,
    llm_kwargs={"max_length": 4096},
    prompt=prompt,
    verbose=True,
    memory=ConversationBufferWindowMemory(k=2),
)

output = chatgpt_chain.predict(
    human_input="I want you to act as a Linux terminal. I will type commands and you will reply with what the terminal should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. Do not write explanations. Do not type commands unless I instruct you to do so. When I need to tell you something in English I will do so by putting text inside curly brackets {like this}. My first command is pwd."
)
print(output)
```

```python
output = chatgpt_chain.predict(human_input="ls ~")
print(output)
```

```python
output = chatgpt_chain.predict(human_input="cd ~")
print(output)
```

```python
output = chatgpt_chain.predict(
    human_input="""echo -e "x=lambda y:y*5+3;print('Result:' + str(x(6)))" > run.py && python3 run.py"""
)
print(output)
```

正如我们从最后一个示例中看到的（它输出了一个可能正确也可能不正确的数字），该模型只是在近似可能的终端输出，而不是实际执行提供的命令。尽管如此，这个示例展示了 Mistral 充足的上下文窗口、代码生成能力以及在对话序列中保持主题的能力。
