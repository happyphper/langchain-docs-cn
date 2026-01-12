---
title: Stack Exchange
---
>[Stack Exchange](https://en.wikipedia.org/wiki/Stack_Exchange) 是一个涵盖多个领域的问答（Q&A）网站网络，每个网站专注于特定主题，其中的问题、答案和用户都受到声誉奖励机制的约束。

本页介绍了如何在 LangChain 中使用 `Stack Exchange API`。

## 安装与设置
- 使用以下命令安装所需依赖：

::: code-group

```bash [pip]
pip install stackapi
```

```bash [uv]
uv add stackapi
```

:::

## 包装器

### 实用工具

存在一个封装此 API 的 StackExchangeAPIWrapper 实用工具。导入此工具的方法如下：

```python
from langchain_community.utilities import StackExchangeAPIWrapper
```

关于此包装器的更详细教程，请参阅 [此笔记本](/oss/javascript/integrations/tools/stackexchange)。

### 工具

你也可以轻松地将此包装器作为工具加载（以便与智能体（Agent）一起使用）。
你可以通过以下方式实现：

```python
from langchain_community.agent_toolkits.load_tools import load_tools
tools = load_tools(["stackexchange"])
```

有关工具的更多信息，请参阅 [此页面](/oss/javascript/integrations/tools)。
