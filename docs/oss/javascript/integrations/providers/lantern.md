---
title: Lantern
---
本页介绍了如何在 LangChain 中使用 [Lantern](https://github.com/lanterndata/lantern)。
内容分为两部分：设置，以及对特定 Lantern 封装器的引用。

## 设置
1. 第一步是创建一个安装了 `lantern` 扩展的数据库。

请按照 [Lantern 安装指南](https://github.com/lanterndata/lantern#-quick-install) 中的步骤安装数据库和扩展。Docker 镜像是最简单的入门方式。

## 封装器

### VectorStore

存在一个围绕 Postgres 向量数据库的封装器，允许您将其用作向量存储，无论是用于语义搜索还是示例选择。

要导入此向量存储：

```python
from langchain_community.vectorstores import Lantern
```

### 用法

有关 Lantern 封装器的更详细演练，请参阅 [此笔记本](/oss/javascript/integrations/vectorstores/lantern)
