---
title: Sema4（前称 Robocorp）
---
>[Robocorp](https://robocorp.com/) 帮助构建和运行可在任何地方、任何规模下无缝运行的 Python 工作程序。

## 安装与设置

你需要安装 `langchain-robocorp` Python 包：

::: code-group

```bash [pip]
pip install langchain-robocorp
```

```bash [uv]
uv add langchain-robocorp
```

:::

你需要一个正在运行的 `Action Server` 实例，以便从你的智能体应用程序与之通信。
关于如何设置 Action Server 并创建你的 Actions，请参阅 [Robocorp 快速入门](https://github.com/robocorp/robocorp#quickstart)。

你可以使用 Action Server 的 `new` 命令来引导一个新项目。

```bash
action-server new
cd ./your-project-name
action-server start
```

## 工具

```python
from langchain_robocorp.toolkits import ActionServerRequestTool
```

## 工具包

查看[使用示例](/oss/javascript/integrations/tools/robocorp)。

```python
from langchain_robocorp import ActionServerToolkit
```
