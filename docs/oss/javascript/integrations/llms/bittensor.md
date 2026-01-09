---
title: Bittensor
---
>[Bittensor](https://bittensor.com/) 是一个类似于比特币的挖矿网络，其内置的激励机制旨在鼓励矿工贡献算力与知识。

>`NIBittensorLLM` 由 [Neural Internet](https://neuralinternet.ai/) 开发，由 `Bittensor` 提供支持。

>该大语言模型（LLM）通过从 `Bittensor 协议` 中为您提供最佳响应，展示了去中心化人工智能的真正潜力。该协议包含多种 AI 模型，例如 `OpenAI`、`LLaMA2` 等。

用户可以在 [验证器端点前端](https://api.neuralinternet.ai/) 查看其日志、请求和 API 密钥。但是，目前禁止更改配置；否则，用户的查询将被阻止。

如果您遇到任何困难或有任何疑问，请随时通过 [GitHub](https://github.com/Kunj-2206)、[Discord](https://discordapp.com/users/683542109248159777) 联系我们的开发者，或加入我们的 Discord 服务器以获取最新更新和咨询 [Neural Internet](https://discord.gg/neuralinternet)。

## NIBittensorLLM 的不同参数与响应处理

```python
import json
from pprint import pprint

from langchain.globals import set_debug
from langchain_community.llms import NIBittensorLLM

set_debug(True)

# NIBittensorLLM 中的系统参数是可选的，但您可以设置任何您希望模型执行的任务
llm_sys = NIBittensorLLM(
    system_prompt="Your task is to determine response based on user prompt.Explain me like I am technical lead of a project"
)
sys_resp = llm_sys(
    "What is bittensor and What are the potential benefits of decentralized AI?"
)
print(f"Response provided by LLM with system prompt set is : {sys_resp}")

# top_responses 参数可以根据其参数值提供多个响应
# 以下代码检索前 10 个矿工的响应，所有响应均为 json 格式

# Json 响应结构如下
""" {
    "choices":  [
                    {"index": Bittensor's Metagraph index number,
                    "uid": Unique Identifier of a miner,
                    "responder_hotkey": Hotkey of a miner,
                    "message":{"role":"assistant","content": Contains actual response},
                    "response_ms": Time in millisecond required to fetch response from a miner}
                ]
    } """

multi_response_llm = NIBittensorLLM(top_responses=10)
multi_resp = multi_response_llm.invoke("What is Neural Network Feeding Mechanism?")
json_multi_resp = json.loads(multi_resp)
pprint(json_multi_resp)
```

## 将 NIBittensorLLM 与 LLMChain 和 PromptTemplate 结合使用

```python
from langchain_classic.chains import LLMChain
from langchain.globals import set_debug
from langchain_community.llms import NIBittensorLLM
from langchain_core.prompts import PromptTemplate

set_debug(True)

template = """Question: {question}

Answer: Let's think step by step."""

prompt = PromptTemplate.from_template(template)

# NIBittensorLLM 中的系统参数是可选的，但您可以设置任何您希望模型执行的任务
llm = NIBittensorLLM(
    system_prompt="Your task is to determine response based on user prompt."
)

llm_chain = LLMChain(prompt=prompt, llm=llm)
question = "What is bittensor?"

llm_chain.run(question)
```

## 将 NIBittensorLLM 与对话代理和 Google 搜索工具结合使用

```python
from langchain_community.utilities import GoogleSearchAPIWrapper
from langchain.tools import Tool

search = GoogleSearchAPIWrapper()

tool = Tool(
    name="Google Search",
    description="Search Google for recent results.",
    func=search.run,
)
```

```python
from langchain_classic import hub
from langchain.agents import (
    AgentExecutor,
    create_agent,
)
from langchain.memory import ConversationBufferMemory
from langchain_community.llms import NIBittensorLLM

tools = [tool]

prompt = hub.pull("hwchase17/react")

llm = NIBittensorLLM(
    system_prompt="Your task is to determine a response based on user prompt"
)

memory = ConversationBufferMemory(memory_key="chat_history")

agent = create_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, memory=memory)

response = agent_executor.invoke({"input": prompt})
```
