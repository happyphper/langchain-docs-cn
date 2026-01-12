---
title: Marqo
---
本页面介绍如何在 LangChain 中使用 Marqo 生态系统。

### **什么是 Marqo？**

Marqo 是一个基于张量（tensor）的搜索引擎，它使用存储在内存 HNSW 索引中的嵌入向量来实现前沿的搜索速度。Marqo 可以通过水平索引分片扩展到数亿文档的规模，并支持异步和非阻塞的数据上传与搜索。Marqo 使用来自 PyTorch、Huggingface、OpenAI 等平台的最新机器学习模型。您可以从预配置的模型开始，也可以使用自己的模型。内置的 ONNX 支持与转换功能可在 CPU 和 GPU 上实现更快的推理和更高的吞吐量。

由于 Marqo 包含自身的推理能力，您的文档可以混合包含文本和图像，您可以将来自其他系统的数据构建的 Marqo 索引引入 LangChain 生态系统，而无需担心嵌入向量的兼容性问题。

Marqo 的部署方式非常灵活，您可以使用我们的 Docker 镜像自行开始，或[联系我们了解我们的托管云服务！](https://www.marqo.ai/pricing)

要使用我们的 Docker 镜像在本地运行 Marqo，[请参阅我们的入门指南。](https://docs.marqo.ai/latest/)

## 安装与设置

- 使用 `pip install marqo` 安装 Python SDK

## 封装器

### VectorStore

Marqo 索引提供了一个封装器，允许您在向量存储框架中使用它们。Marqo 允许您从一系列模型中选择用于生成嵌入向量，并公开一些预处理配置。

Marqo 向量存储还可以处理现有的多模态索引，其中您的文档混合包含图像和文本，更多信息请参阅[我们的文档](https://docs.marqo.ai/latest/#multi-modal-and-cross-modal-search)。请注意，使用现有的多模态索引实例化 Marqo 向量存储将禁用通过 LangChain 向量存储的 `add_texts` 方法向其添加任何新文档的功能。

导入此向量存储：

```python
from langchain_community.vectorstores import Marqo
```

有关 Marqo 封装器及其一些独特功能的更详细说明，请参阅[此笔记本](/oss/javascript/integrations/vectorstores/marqo)
