---
title: StackExchange
---
>[Stack Exchange](https://stackexchange.com/) 是一个涵盖多个领域的问答（Q&A）网站网络，每个网站专注于特定主题，其中的问题、答案和用户都受到声誉奖励机制的约束。该声誉系统使得网站能够实现自我管理。

`StackExchange` 组件将 StackExchange API 集成到 LangChain 中，允许访问 Stack Exchange 网络中的 [StackOverflow](https://stackoverflow.com/) 网站。Stack Overflow 专注于计算机编程领域。

本笔记本将介绍如何使用 `StackExchange` 组件。

首先，我们需要安装实现了 Stack Exchange API 的 Python 包 `stackapi`。

```python
pip install -U stackapi
```

```python
from langchain_community.utilities import StackExchangeAPIWrapper

stackexchange = StackExchangeAPIWrapper()

stackexchange.run("zsh: command not found: python")
```
