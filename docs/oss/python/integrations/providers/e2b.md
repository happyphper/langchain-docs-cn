---
title: E2B
---
>[E2B](https://e2b.dev/) 为 AI 生成的代码执行提供开源的安全沙箱。更多信息请参见[此处](https://github.com/e2b-dev)。

## 安装与设置

你需要安装一个 Python 包：

::: code-group

```bash [pip]
pip install e2b_code_interpreter
```

```bash [uv]
uv add e2b_code_interpreter
```

:::

## 工具

查看[使用示例](/oss/python/integrations/tools/e2b_data_analysis)。

```python
from langchain_community.tools import E2BDataAnalysisTool
```
