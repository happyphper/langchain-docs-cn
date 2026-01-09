---
title: NASA 工具包
---
本笔记本展示了如何使用智能体（agent）与 NASA 工具包进行交互。该工具包提供了对 NASA 图像与视频库 API 的访问，并有望在未来版本中扩展并纳入其他可访问的 NASA API。

**注意：当未指定所需媒体结果数量时，NASA 图像与视频库的搜索查询可能导致大量响应。在使用智能体消耗 LLM 令牌额度前，请务必考虑这一点。**

## 使用示例

---

### 初始化智能体

```python
pip install -qU langchain-community
```

```python
from langchain.agents import AgentType, initialize_agent
from langchain_community.agent_toolkits.nasa.toolkit import NasaToolkit
from langchain_community.utilities.nasa import NasaAPIWrapper
from langchain_openai import OpenAI

llm = OpenAI(temperature=0, openai_api_key="")
nasa = NasaAPIWrapper()
toolkit = NasaToolkit.from_nasa_api_wrapper(nasa)
agent = initialize_agent(
    toolkit.get_tools(), llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
)
```

### 查询媒体资源

```python
agent.run(
    "Can you find three pictures of the moon published between the years 2014 and 2020?"
)
```

### 查询媒体资源的详细信息

```python
output = agent.run(
    "I've just queried an image of the moon with the NASA id NHQ_2019_0311_Go Forward to the Moon."
    " Where can I find the metadata manifest for this asset?"
)
```
