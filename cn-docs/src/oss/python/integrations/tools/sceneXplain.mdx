---
title: SceneXplain
---
[SceneXplain](https://scenex.jina.ai/) 是一个可通过 SceneXplain 工具访问的图像描述服务。

要使用此工具，您需要创建一个账户并从[网站](https://scenex.jina.ai/api)获取您的 API 令牌。然后即可实例化该工具。

```python
import os

os.environ["SCENEX_API_KEY"] = "<YOUR_API_KEY>"
```

```python
from langchain.agents import load_tools

tools = load_tools(["sceneXplain"])
```

或者直接实例化该工具。

```python
from langchain_community.tools import SceneXplainTool

tool = SceneXplainTool()
```

## 在智能体中使用

该工具可以在任何 LangChain 智能体中使用，如下所示：

```python
from langchain.agents import initialize_agent
from langchain.memory import ConversationBufferMemory
from langchain_openai import OpenAI

llm = OpenAI(temperature=0)
memory = ConversationBufferMemory(memory_key="chat_history")
agent = initialize_agent(
    tools, llm, memory=memory, agent="conversational-react-description", verbose=True
)
output = agent.run(
    input=(
        "What is in this image https://storage.googleapis.com/causal-diffusion.appspot.com/imagePrompts%2F0rw369i5h9t%2Foriginal.png. "
        "Is it movie or a game? If it is a movie, what is the name of the movie?"
    )
)

print(output)
```

```text
> 进入新的 AgentExecutor 链...

思考：我需要使用工具吗？是的
行动：图像解释器
行动输入：https://storage.googleapis.com/causal-diffusion.appspot.com/imagePrompts%2F0rw369i5h9t%2Foriginal.png
观察：在一个迷人而奇妙的场景中，一个小女孩和她毛茸茸的伙伴——可爱的龙猫，一起在雨中勇敢前行。画面描绘了他们站在一个繁忙的街角，一把亮黄色的雨伞为他们遮挡着雨水。女孩穿着一件欢快的黄色连衣裙，双手握着雨伞，抬头望着龙猫，脸上带着惊奇和喜悦的表情。

与此同时，龙猫高高地站在他年轻的朋友身边，自豪地举着自己的雨伞，保护他们俩免受大雨的侵袭。他毛茸茸的身体呈现出丰富的灰色和白色调，而他大大的耳朵和圆圆的眼睛赋予了他一种可爱的魅力。

在场景的背景中，可以看到一个路标从人行道上伸出，周围是纷飞的雨滴。路标表面装饰着汉字，增添了文化多样性和神秘感。尽管天气阴沉，但这幅温馨的画面中却洋溢着一种不可否认的欢乐和友爱之情。
思考：我需要使用工具吗？不需要
AI：这张图片似乎是 1988 年日本奇幻动画电影《龙猫》中的一个定格画面。这部电影讲述了两个小女孩，小月和小梅，在乡村探险并与包括主角龙猫在内的神奇森林精灵成为朋友的故事。

> 链结束。
这张图片似乎是 1988 年日本奇幻动画电影《龙猫》中的一个定格画面。这部电影讲述了两个小女孩，小月和小梅，在乡村探险并与包括主角龙猫在内的神奇森林精灵成为朋友的故事。
```
