---
title: 鼎鼎数据库
---
>[DingoDB](https://github.com/dingodb) 是一个分布式多模态向量数据库。它结合了数据湖和向量数据库的特性，允许存储任何类型的数据（键值对、PDF、音频、视频等），无论其大小如何。利用 DingoDB，您可以构建自己的向量海洋（继数据仓库和数据湖之后的下一代数据架构）。这使得能够通过单一 SQL 实时分析结构化和非结构化数据，并具有极低的延迟。

## 安装与设置

安装 Python SDK

::: code-group

```bash [pip]
pip install dingodb
```

```bash [uv]
uv add dingodb
```

:::

## VectorStore

DingoDB 索引存在一个包装器，允许您将其用作向量存储，无论是用于语义搜索还是示例选择。

要导入此向量存储：

```python
from langchain_community.vectorstores import Dingo
```

有关 DingoDB 包装器的更详细演练，请参阅 [此笔记本](/oss/javascript/integrations/vectorstores/dingo)
