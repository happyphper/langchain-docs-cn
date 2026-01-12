---
title: Fiddler
---
>[Fiddler](https://www.fiddler.ai/) 提供了一个统一的平台，用于在企业规模上监控、解释、分析并改进机器学习部署。

## 安装与设置

[通过 Fiddler](https://demo.fiddler.ai) 设置您的模型：

*   您用于连接 Fiddler 的 URL
*   您的组织 ID
*   您的授权令牌

安装 Python 包：

::: code-group

```bash [pip]
pip install fiddler-client
```

```bash [uv]
uv add fiddler-client
```

:::

## 回调函数

```python
from langchain_community.callbacks.fiddler_callback import FiddlerCallbackHandler
```

查看[示例](/oss/javascript/integrations/callbacks/fiddler)。
