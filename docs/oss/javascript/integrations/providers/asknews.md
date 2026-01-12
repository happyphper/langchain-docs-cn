---
title: AskNews
---
[AskNews](https://asknews.app/) 通过每日处理和索引超过 30 万篇文章，为语言模型提供最新的全球或历史新闻，并通过低延迟端点提供针对提示优化的回答，同时确保其新闻报道的透明度和多样性。

## 安装与设置

首先，你需要安装 `asknews` Python 包。

::: code-group

```bash [pip]
pip install asknews
```

```bash [uv]
uv add asknews
```

:::

你还需要设置 AskNews API 凭证，这些凭证可以在 [AskNews 控制台](https://my.asknews.app/) 生成。

## 检索器

查看 [使用示例](/oss/javascript/integrations/retrievers/asknews)。

```python
from langchain_community.retrievers import AskNewsRetriever
```

## 工具

查看 [使用示例](/oss/javascript/integrations/tools/asknews)。

```python
from langchain_community.tools.asknews import AskNewsSearch
```
