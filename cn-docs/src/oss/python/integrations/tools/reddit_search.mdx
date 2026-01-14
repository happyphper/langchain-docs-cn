---
title: Reddit 搜索
---
在本笔记本中，我们将学习 Reddit 搜索工具的工作原理。
首先，请确保已通过以下命令安装 praw：

```python
pip install -qU  praw
```

然后，您需要设置正确的 API 密钥和环境变量。您需要创建一个 Reddit 用户账户并获取凭证。因此，请访问 [www.reddit.com](https://www.reddit.com) 并注册一个 Reddit 用户账户。
接着，访问 [www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) 并创建一个应用以获取您的凭证。
您应该从创建应用的过程中获得 `client_id` 和 `secret`。现在，您可以将这些字符串粘贴到 `client_id` 和 `client_secret` 变量中。
注意：`user_agent` 可以填写任意字符串。

```python
client_id = ""
client_secret = ""
user_agent = ""
```

```python
from langchain_community.tools.reddit_search.tool import RedditSearchRun
from langchain_community.utilities.reddit_search import RedditSearchAPIWrapper

search = RedditSearchRun(
    api_wrapper=RedditSearchAPIWrapper(
        reddit_client_id=client_id,
        reddit_client_secret=client_secret,
        reddit_user_agent=user_agent,
    )
)
```

然后，您可以设置您的查询，例如，您想要查询哪个 subreddit、希望返回多少帖子、希望结果如何排序等。

```python
from langchain_community.tools.reddit_search.tool import RedditSearchSchema

search_params = RedditSearchSchema(
    query="beginner", sort="new", time_filter="week", subreddit="python", limit="2"
)
```

最后，运行搜索并获取结果。

```python
result = search.run(tool_input=search_params.dict())
```

```python
print(result)
```

以下是打印结果的示例。
注意：根据 subreddit 中的最新帖子，您可能会得到不同的输出，但格式应相似。

> 在 r/python 中搜索到 2 个帖子：
> 帖子标题：'在 Visual Studio Code 中设置 Github Copilot'
> 用户：Feisty-Recording-715
> Subreddit：r/Python：
> 正文：🛠️ 本教程非常适合希望加强版本控制理解的初学者，或寻求在 Visual Studio Code 中快速参考 GitHub 设置的经验丰富的开发者。
>
>🎓 通过本视频，您将掌握自信地管理代码库、与他人协作以及为 GitHub 上的开源项目做出贡献的技能。
>
>
>视频链接：[youtu.be/IdT1BhrSfdo?si=mV7xVpiyuhlD8Zrw](https://youtu.be/IdT1BhrSfdo?si=mV7xVpiyuhlD8Zrw)
>
>欢迎您的反馈
> 帖子 URL：[www.reddit.com/r/Python/comments/1823wr7/setup_github_copilot_in_visual_studio_code/](https://www.reddit.com/r/Python/comments/1823wr7/setup_github_copilot_in_visual_studio_code/)
> 帖子类别：N/A。
> 得分：0
>
>帖子标题：'使用 pygame 和 PySide6 制作的中国跳棋游戏，支持自定义机器人'
>用户：HenryChess
>Subreddit：r/Python：
> 正文：GitHub 链接：[github.com/henrychess/pygame-chinese-checkers](https://github.com/henrychess/pygame-chinese-checkers)
>
>我不确定这算是初学者还是中级水平。我认为我仍在初学者阶段，所以我将其标记为初学者。
>
>这是一个支持 2 到 3 名玩家的中国跳棋（又名 Sternhalma）游戏。我编写的机器人很容易击败，因为它们主要用于调试代码的游戏逻辑部分。但是，您可以编写自己的自定义机器人。GitHub 页面上有指南。
> 帖子 URL：[www.reddit.com/r/Python/comments/181xq0u/a_chinese_checkers_game_made_with_pygame_and/](https://www.reddit.com/r/Python/comments/181xq0u/a_chinese_checkers_game_made_with_pygame_and/)
> 帖子类别：N/A。
 > 得分：1

## 在智能体链中使用工具

Reddit 搜索功能也作为多输入工具提供。在此示例中，我们改编了[文档中的现有代码](https://python.langchain.com/v0.1/docs/modules/memory/agent_with_memory/)，并使用 ChatOpenAI 创建一个具有记忆的智能体链。该智能体链能够从 Reddit 拉取信息，并使用这些帖子来响应后续输入。

要运行此示例，请添加您的 Reddit API 访问信息，并从 [OpenAI API](https://help.openai.com/en/articles/4936850-where-do-i-find-my-api-key) 获取 OpenAI 密钥。

```python
# 改编自 /docs/modules/agents/how_to/sharedmemory_for_tools 的代码

from langchain.agents import AgentExecutor, StructuredChatAgent
from langchain_classic.chains import LLMChain
from langchain.memory import ConversationBufferMemory, ReadOnlySharedMemory
from langchain_community.tools.reddit_search.tool import RedditSearchRun
from langchain_community.utilities.reddit_search import RedditSearchAPIWrapper
from langchain_core.prompts import PromptTemplate
from langchain.tools import Tool
from langchain_openai import ChatOpenAI

# 提供 Reddit 的密钥
client_id = ""
client_secret = ""
user_agent = ""
# 提供 OpenAI 的密钥
openai_api_key = ""

template = """这是人类与机器人之间的对话：

{chat_history}

为 {input} 编写对话摘要：
"""

prompt = PromptTemplate(input_variables=["input", "chat_history"], template=template)
memory = ConversationBufferMemory(memory_key="chat_history")

prefix = """与人类进行对话，尽可能回答以下问题。您可以访问以下工具："""
suffix = """开始！"

{chat_history}
问题：{input}
{agent_scratchpad}"""

tools = [
    RedditSearchRun(
        api_wrapper=RedditSearchAPIWrapper(
            reddit_client_id=client_id,
            reddit_client_secret=client_secret,
            reddit_user_agent=user_agent,
        )
    )
]

prompt = StructuredChatAgent.create_prompt(
    prefix=prefix,
    tools=tools,
    suffix=suffix,
    input_variables=["input", "chat_history", "agent_scratchpad"],
)

llm = ChatOpenAI(temperature=0, openai_api_key=openai_api_key)

llm_chain = LLMChain(llm=llm, prompt=prompt)
agent = StructuredChatAgent(llm_chain=llm_chain, verbose=True, tools=tools)
agent_chain = AgentExecutor.from_agent_and_tools(
    agent=agent, verbose=True, memory=memory, tools=tools
)

# 回答第一个提示需要使用 Reddit 搜索工具。
agent_chain.run(input="本周 r/langchain 上最新的帖子是什么？")
# 回答后续提示会使用记忆。
agent_chain.run(input="帖子的作者是谁？")
```
