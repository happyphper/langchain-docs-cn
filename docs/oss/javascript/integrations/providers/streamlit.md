---
title: Streamlit
---
>[Streamlit](https://streamlit.io/) 是一个更快地构建和共享数据应用的方式。
>`Streamlit` 能在几分钟内将数据脚本转换为可共享的 Web 应用。完全使用纯 Python。无需前端经验。
>查看更多示例，请访问 [streamlit.io/generative-ai](https://streamlit.io/generative-ai)。

## 安装与设置

我们需要安装 `streamlit` Python 包：

::: code-group

```bash [pip]
pip install streamlit
```

```bash [uv]
uv add streamlit
```

:::

## 回调函数

查看[使用示例](/oss/javascript/integrations/callbacks/streamlit)。

```python
from langchain_community.callbacks import StreamlitCallbackHandler
```
