---
title: 捷豹
---
本页介绍如何在 LangChain 中使用 Jaguar 向量数据库。
内容包含三个部分：简介、安装与设置，以及 Jaguar API。

## 简介

Jaguar 向量数据库具有以下特点：

1. 它是一个分布式向量数据库
2. JaguarDB 的“ZeroMove”特性支持即时水平扩展
3. 多模态：支持嵌入向量、文本、图像、视频、PDF、音频、时间序列和地理空间数据
4. 全主节点：支持并行读写
5. 异常检测能力
6. RAG 支持：将 LLM 与专有数据和实时数据相结合
7. 共享元数据：跨多个向量索引共享元数据
8. 距离度量：欧几里得距离、余弦距离、内积、曼哈顿距离、切比雪夫距离、汉明距离、杰卡德距离、闵可夫斯基距离

[Jaguar 可扩展向量数据库概述](http://www.jaguardb.com)

您可以在 Docker 容器中运行 JaguarDB；也可以下载软件并在云端或本地运行。

## 安装与设置

- 在一台或多台主机上安装 JaguarDB
- 在一台主机上安装 Jaguar HTTP 网关服务器
- 安装 JaguarDB HTTP 客户端包

具体步骤请参阅 [Jaguar 文档](http://www.jaguardb.com/support.html)

客户端程序中的环境变量：

## Jaguar API

结合 LangChain，可以通过在 Python 中导入来使用 Jaguar 客户端类：

```python
from langchain_community.vectorstores.jaguar import Jaguar
```

Jaguar 类支持的 API 函数包括：

- `add_texts`
- `add_documents`
- `from_texts`
- `from_documents`
- `similarity_search`
- `is_anomalous`
- `create`
- `delete`
- `clear`
- `drop`
- `login`
- `logout`

有关 Jaguar API 的更多详细信息，请参阅 [此笔记本](/oss/javascript/integrations/vectorstores/jaguar)
