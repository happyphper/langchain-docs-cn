---
title: Steam 工具包
---
>[Steam (Wikipedia)](https://en.wikipedia.org/wiki/Steam_(service)) 是一个由 `Valve Corporation` 开发的视频游戏数字分发服务和商店平台。它自动为 Valve 的游戏提供更新，并扩展到分发第三方游戏。`Steam` 提供各种功能，例如集成了 Valve 反作弊措施的游戏服务器匹配、社交网络和游戏流媒体服务。

>[Steam](https://store.steampowered.com/about/) 是玩游戏、讨论游戏和创作游戏的终极目的地。

Steam 工具包包含两个工具：

- `Game Details`（游戏详情）
- `Recommended Games`（推荐游戏）

本指南将引导您如何使用 LangChain 与 Steam API 结合，根据您当前的 Steam 游戏库存或您提供的某些 Steam 游戏来获取 Steam 游戏推荐或收集相关信息。

## 设置

我们需要安装两个 Python 库。

## 导入

```python
pip install -qU python-steam-api python-decouple steamspypi
```

## 设置环境变量

要使用此工具包，请准备好您的 OpenAI API 密钥、Steam API 密钥（来自[此处](https://steamcommunity.com/dev/apikey)）以及您自己的 SteamID。一旦获得 Steam API 密钥，您可以将其作为环境变量输入到下方。
工具包将读取名为 "STEAM_KEY" 的环境变量作为 API 密钥进行身份验证，因此请在此处设置它们。您还需要设置您的 "OPENAI_API_KEY" 和 "STEAM_ID"。

```python
import os

os.environ["STEAM_KEY"] = ""
os.environ["STEAM_ID"] = ""
os.environ["OPENAI_API_KEY"] = ""
```

## 初始化

初始化 LLM、SteamWebAPIWrapper、SteamToolkit，最重要的是初始化用于处理您查询的 langchain 代理！

## 示例

```python
from langchain_community.agent_toolkits.steam.toolkit import SteamToolkit
from langchain_community.utilities.steam import SteamWebAPIWrapper

steam = SteamWebAPIWrapper()
tools = [steam.run]
```

```python
from langchain.agents import create_agent

agent = create_agent("gpt-4.1-mini", tools)
```

```python
events = agent.stream(
    {"messages": [("user", "can you give the information about the game Terraria?")]},
    stream_mode="values",
)
for event in events:
    event["messages"][-1].pretty_print()
```

```text
================================ Human Message =================================

can you give the information about the game Terraria?
================================== Ai Message ==================================
Tool Calls:
  run (call_6vHAXSIL2MPugXxlv5uyf9Xk)
 Call ID: call_6vHAXSIL2MPugXxlv5uyf9Xk
  Args:
    mode: get_games_details
    game: Terraria
================================= Tool Message =================================
Name: run

The id is: [105600]
The link is: https://store.steampowered.com/app/105600/Terraria/?snr=1_7_15__13
The price is: $9.99
The summary of the game is: Dig, Fight, Explore, Build:  The very world is at your fingertips as you fight for survival, fortune, and glory.   Will you delve deep into cavernous expanses in search of treasure and raw materials with which to craft ever-evolving gear, machinery, and aesthetics?   Perhaps you will choose instead to seek out ever-greater foes to test your mettle in combat?   Maybe you will decide to construct your own city to house the host of mysterious allies you may encounter along your travels? In the World of Terraria, the choice is yours!Blending elements of classic action games with the freedom of sandbox-style creativity, Terraria is a unique gaming experience where both the journey and the destination are completely in the player’s control.   The Terraria adventure is truly as unique as the players themselves!  Are you up for the monumental task of exploring, creating, and defending a world of your own?   Key features: Sandbox Play  Randomly generated worlds Free Content Updates
The supported languages of the game are: English, French, Italian, German, Spanish - Spain, Polish, Portuguese - Brazil, Russian, Simplified Chinese

================================== Ai Message ==================================

Terraria 是一款您可以挖掘、战斗、探索和建造的游戏，整个世界都在您的指尖。游戏让您自由地生存、寻求财富并赢得荣耀。您可以深入探索洞穴般的广阔空间，寻找宝藏和材料来制作各种装备、机械和装饰品。或者，您可以挑战强大的敌人，或者建造自己的城市来容纳您在旅途中可能遇到的神秘盟友。该游戏融合了经典动作元素和沙盒风格的创造力，提供了一种独特的体验，您的旅程和目的地完全由您掌控。

Terraria 的主要功能包括沙盒玩法、随机生成的世界和免费内容更新。

该游戏售价为 9.99 美元，支持多种语言，包括英语、法语、意大利语、德语、西班牙语（西班牙）、波兰语、葡萄牙语（巴西）、俄语和简体中文。

您可以在此处找到更多信息并进行购买：[Steam 上的 Terraria](https://store.steampowered.com/app/105600/Terraria/?snr=1_7_15__13)。
```

```python

```
