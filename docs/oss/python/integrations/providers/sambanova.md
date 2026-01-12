---
title: SambaNova
---
客户正转向 [SambaNova](https://sambanova.ai/)，以快速部署最先进的 AI 能力来获取竞争优势。我们专为企业级 AI 构建的平台是下一代 AI 计算的技术基石。我们驱动着基础模型，释放出数据中蕴含的宝贵商业洞察。

专为 AI 设计的 SambaNova RDU 采用了革命性的数据流架构。这种设计使得 RDU 在处理这些工作负载时比 GPU 高效得多，因为它消除了对内存的冗余调用，而这是 GPU 运作方式固有的限制。这种内置的高效性是 RDU 能够在更小的物理占用空间内实现比 GPU 更高性能的特性之一。

在我们的架构之上，我们开发了一些平台，让公司和开发者能够充分利用 RDU 处理器和开源模型。

## 安装与设置

安装集成包：

::: code-group

```bash
pip install langchain-sambanova
```

```bash [uv]
uv add langchain-sambanova
```

:::

## API 密钥
将您的 API 密钥设置为环境变量：

如果您是 SambaCloud 用户，请申请一个 [API 密钥](http://cloud.sambanova.ai/apis?utm_source=langchain&utm_medium=external&utm_campaign=cloud_signup) 并将其设置为环境变量：

```bash
export SAMBANOVA_API_KEY="your-sambacloud-api-key-here"
```

或者，如果您是 SambaStack 用户，请将您的基础 URL 和 API 密钥设置为环境变量：

```bash
export SAMBANOVA_API_BASE="your-sambastack-envirronment-base-url-here"
export SAMBANOVA_API_KEY="your-sambastack-api-key-here"
```

## 聊天模型

有关 `ChatSambaNova` 组件的详细说明，请参阅 [使用示例](/oss/python/integrations/chat/sambanova)

```python
from langchain_sambanova import ChatSambaNova
```

## 嵌入模型

有关 `SambaNovaEmbeddings` 组件的详细说明，请参阅 [使用示例](/oss/python/integrations/text_embedding/sambanova)

```python
from langchain_sambanova import SambaNovaEmbeddings
```

[SambaNova API 参考](https://docs.sambanova.ai/cloud/api-reference)
