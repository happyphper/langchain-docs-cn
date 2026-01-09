---
title: Infino
---
>[Infino](https://github.com/infinohq/infino) 是一个开源的可观测性平台，能够将指标和应用日志存储在一起。

`Infino` 的主要功能包括：
- **指标追踪**：捕获 LLM 模型处理请求的耗时、错误、令牌数量以及特定 LLM 的成本指示。
- **数据追踪**：记录并存储每次 LangChain 交互的提示、请求和响应数据。
- **图表可视化**：生成随时间变化的基础图表，描绘请求时长、错误发生次数、令牌数量和成本等指标。

## 安装与设置

首先，你需要安装 `infinopy` Python 包，操作如下：

::: code-group

```bash [pip]
pip install infinopy
```

```bash [uv]
uv add infinopy
```

:::

如果你已经有一个正在运行的 `Infino Server`，那么就可以直接使用了；如果没有，请按照以下步骤启动它：

- 确保已安装 Docker
- 在终端中运行以下命令：
```
docker run --rm --detach --name infino-example -p 3000:3000 infinohq/infino:latest
```

## 使用 Infino

查看 [`InfinoCallbackHandler` 的使用示例](/oss/integrations/callbacks/infino)。

```python
from langchain.callbacks import InfinoCallbackHandler
```
