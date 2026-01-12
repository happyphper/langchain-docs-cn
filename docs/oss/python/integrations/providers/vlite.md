---
title: vlite
---
本页介绍如何在 LangChain 中使用 [vlite](https://github.com/sdan/vlite)。vlite 是一个简单快速的向量数据库，用于存储和检索嵌入向量。

## 安装与设置

要安装 vlite，请运行以下命令：

::: code-group

```bash [pip]
pip install vlite
```

```bash [uv]
uv add vlite
```

:::

如需 PDF OCR 支持，请安装 `vlite[ocr]` 额外依赖：

::: code-group

```bash [pip]
pip install "vlite[ocr]"
```

```bash [uv]
uv add "vlite[ocr]"
```

:::

## VectorStore

vlite 提供了对其向量数据库的封装，允许你将其用作向量存储，以进行语义搜索和示例选择。

导入 vlite 向量存储：

```python
from langchain_community.vectorstores import vlite
```

### 使用方法

关于 vlite 封装的更详细说明，请参阅 [此笔记本](/oss/python/integrations/vectorstores/vlite)。
