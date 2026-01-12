---
title: MCP 工具箱
---
[LangChain 中的 MCP Toolbox](https://googleapis.github.io/genai-toolbox/getting-started/introduction/) 允许你为智能体（agent）配备一组工具。当智能体接收到查询时，它可以智能地选择并使用 MCP Toolbox 提供的最合适的工具来满足请求。

## 它是什么？

MCP Toolbox 本质上是一个存放你所有工具的容器。可以把它想象成你智能体的多功能设备；它可以容纳你创建的任何工具。然后，智能体根据用户的输入来决定使用哪个具体的工具。

当你有一个需要执行多种不同能力任务的智能体时，这尤其有用。

## 安装

要开始使用，你需要安装必要的包：

::: code-group

```bash [pip]
pip install toolbox-langchain
```

```bash [uv]
uv add toolbox-langchain
```

:::

## 教程

关于如何创建、配置 MCP Toolbox 并将其与你的智能体一起使用的完整、分步指南，请参阅我们详细的 Jupyter notebook 教程。

**[➡️ 在此查看完整教程](/oss/javascript/integrations/tools/mcp_toolbox)**。
