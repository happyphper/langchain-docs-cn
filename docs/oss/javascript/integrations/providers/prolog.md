---
title: SWI-Prolog
---
SWI-Prolog 提供了一个全面的免费 Prolog 环境。

## 安装与设置

安装 SWI-Prolog 后，使用 pip 安装 langchain-prolog：

::: code-group

```bash [pip]
pip install langchain-prolog
```

```bash [uv]
uv add langchain-prolog
```

:::

## 工具

`PrologTool` 类允许生成使用 Prolog 规则来生成答案的 LangChain 工具。

```python
from langchain_prolog import PrologConfig, PrologTool
```

查看[使用示例](/oss/integrations/tools/prolog_tool)。

同一指南中也包含了 `PrologRunnable` 的使用示例，它允许生成使用 Prolog 规则来生成答案的 LangChain 可运行对象。
