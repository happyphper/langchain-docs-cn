---
title: Iugu
---
>[Iugu](https://www.iugu.com/) 是一家巴西的服务和软件即服务（SaaS）公司。它为电子商务网站和移动应用程序提供支付处理软件和应用程序编程接口。

本笔记本介绍了如何将数据从 `Iugu REST API` 加载到可以输入 LangChain 的格式，并提供了向量化的使用示例。

```python
from langchain.indexes import VectorstoreIndexCreator
from langchain_community.document_loaders import IuguLoader
```

Iugu API 需要一个访问令牌，该令牌可以在 Iugu 仪表板中找到。

此文档加载器还需要一个 `resource` 选项，用于定义您要加载的数据。

可用的资源如下：

`文档` [文档](https://dev.iugu.com/reference/metadados)

```python
iugu_loader = IuguLoader("charges")
```

```python
# 从加载器创建向量存储检索器
# 更多详情请参阅 https://python.langchain.com/en/latest/modules/data_connection/getting_started.html

index = VectorstoreIndexCreator().from_loaders([iugu_loader])
iugu_doc_retriever = index.vectorstore.as_retriever()
```
