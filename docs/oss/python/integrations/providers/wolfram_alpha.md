---
title: Wolfram Alpha
---
>[WolframAlpha](https://en.wikipedia.org/wiki/WolframAlpha) 是由 `Wolfram Research` 开发的答案引擎。
> 它通过从外部来源的数据进行计算来回答事实性查询。

本页介绍了如何在 LangChain 中使用 `Wolfram Alpha API`。

## 安装与设置
- 使用以下命令安装所需依赖：

::: code-group

```bash [pip]
pip install wolframalpha
```

```bash [uv]
uv add wolframalpha
```

:::

- 访问 Wolfram Alpha 并在[此处](https://developer.wolframalpha.com/)注册开发者账户。
- 创建一个应用并获取你的 `APP ID`。
- 将你的 APP ID 设置为环境变量 `WOLFRAM_ALPHA_APPID`。

## 包装器

### 工具类

存在一个封装此 API 的 WolframAlphaAPIWrapper 工具类。导入此工具类的方法如下：

```python
from langchain_community.utilities.wolfram_alpha import WolframAlphaAPIWrapper
```

关于此包装器的更详细说明，请参阅[此笔记本](/oss/python/integrations/tools/wolfram_alpha)。

### 工具

你也可以轻松地将此包装器作为工具加载（以便与智能体配合使用）。
你可以通过以下方式实现：

```python
from langchain_community.agent_toolkits.load_tools import load_tools
tools = load_tools(["wolfram-alpha"])
```

有关工具的更多信息，请参阅[此页面](/oss/python/integrations/tools)。
