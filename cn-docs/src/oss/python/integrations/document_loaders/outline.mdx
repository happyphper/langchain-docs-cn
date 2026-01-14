---
title: 大纲文档加载器
---
>[Outline](https://www.getoutline.com/) 是一个开源的协作知识库平台，专为团队信息共享而设计。

本笔记本展示了如何从您的 Outline 知识库集合中获取 LangChain 文档。

## 概述

[Outline 文档加载器](https://github.com/10Pines/langchain-outline) 可用于将 Outline 知识库集合加载为 LangChain 文档，以便集成到检索增强生成 (RAG) 工作流中。

此示例演示了：

*   设置一个文档加载器，以从 Outline 实例加载所有文档。

### 设置

开始之前，请确保已设置以下环境变量：

*   `OUTLINE_API_KEY`：用于验证 Outline 实例身份的 API 密钥 ([www.getoutline.com/developers#section/Authentication](https://www.getoutline.com/developers#section/Authentication))。
*   `OUTLINE_INSTANCE_URL`：您的 Outline 实例的 URL（包含协议）。

```python
import os

os.environ["OUTLINE_API_KEY"] = "ol_api_xyz123"
os.environ["OUTLINE_INSTANCE_URL"] = "https://app.getoutline.com"
```

## 初始化

要初始化 OutlineLoader，您需要以下参数：

*   `outline_base_url`：您的 Outline 实例的 URL（或者将从环境变量中获取）。
*   `outline_api_key`：用于验证 Outline 实例身份的 API 密钥（或者将从环境变量中获取）。
*   `outline_collection_id_list`：要检索的知识库集合 ID 列表。如果为 None，则将检索所有集合。
*   `page_size`：由于 Outline API 使用分页结果，您可以配置每个 API 请求将检索多少条结果（文档）。如果未指定，将使用默认值。

## 实例化

```python
# 选项 1：使用环境变量（确保已设置）
from langchain_outline.document_loaders.outline import OutlineLoader

loader = OutlineLoader()

# 选项 2：直接传递参数
loader = OutlineLoader(
    outline_base_url="YOUR_OUTLINE_URL", outline_api_key="YOUR_API_KEY"
)
```

## 加载

要加载并返回 Outline 实例中所有可用的文档：

```python
loader.load()
```

## 惰性加载

`lazy_load` 方法允许您从 Outline 知识库集合中迭代加载文档，在获取每个文档时将其生成：

```python
loader.lazy_load()
```

---

## API 参考

有关所有 `Outline` 功能和配置的详细文档，请参阅 API 参考：[www.getoutline.com/developers](https://www.getoutline.com/developers)
