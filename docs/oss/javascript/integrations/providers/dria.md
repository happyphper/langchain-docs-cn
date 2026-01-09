---
title: Dria
---
>[Dria](https://dria.co/) 是一个公共 RAG 模型中心，供开发者贡献和使用共享的嵌入湖。

关于 LangChain 与 Dria 集成的更多详细信息，请参阅[此页面](https://dria.co/docs/integrations/langchain)。

## 安装与设置

你需要安装一个 Python 包：

::: code-group

```bash [pip]
pip install dria
```

```bash [uv]
uv add dria
```

:::

你需要从 Dria 获取一个 API 密钥。你可以通过在 [Dria](https://dria.co/) 注册来获取。

## 检索器

查看[使用示例](/oss/integrations/retrievers/dria_index)。

```python
from langchain_community.retrievers import DriaRetriever
```
