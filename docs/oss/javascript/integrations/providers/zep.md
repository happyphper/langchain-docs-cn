---
title: Zep
---
> 从聊天历史中回忆、理解并提取数据。为个性化 AI 体验提供动力。

>[Zep](https://www.getzep.com) 是一个面向 AI 助手应用的长时记忆服务。
> 借助 Zep，您可以让 AI 助手具备回忆过去对话的能力，无论对话发生在多久以前，
> 同时还能减少幻觉、降低延迟和成本。

## Zep 的工作原理

Zep 持久化存储并回忆聊天历史，并自动从这些聊天历史中生成摘要和其他衍生数据。
它还会对消息和摘要进行嵌入，使您能够搜索 Zep 以获取过去对话中的相关上下文。
Zep 异步执行所有这些操作，确保这些操作不会影响用户的聊天体验。
数据被持久化到数据库中，允许您在业务增长需要时进行扩展。

Zep 还为文档向量搜索提供了一个简单易用的抽象层，称为文档集合。
这旨在补充 Zep 的核心记忆功能，但并非设计为通用的向量数据库。

Zep 让您能够更有意识地构建提示：
- 自动添加最近的几条消息，数量可根据您的应用自定义；
- 添加上述消息之前近期对话的摘要；
- 和/或从整个聊天会话中提取的上下文相关的摘要或消息。
- 和/或来自 Zep 文档集合的相关业务数据。

## 什么是 Zep Cloud？
[Zep Cloud](https://www.getzep.com) 是一项托管服务，其核心是 Zep 开源项目。
除了 Zep 开源版的内存管理功能外，Zep Cloud 还提供：
- **事实提取**：自动从对话中构建事实表，无需预先定义数据模式。
- **对话分类**：即时准确地分类聊天对话。理解用户意图和情绪，细分用户群体等。基于语义上下文路由链，并触发事件。
- **结构化数据提取**：使用您定义的模式，快速从聊天对话中提取业务数据。理解您的助手接下来应该询问什么以完成任务。

## Zep 开源版
Zep 提供了一个开源版本，支持自托管选项。
更多信息请参考 [Zep 开源版](https://github.com/getzep/zep) 仓库。
您还可以找到与 Zep 开源版兼容的 [检索器](/oss/integrations/retrievers/zep_memorystore) 和 [向量存储](/oss/integrations/vectorstores/zep) 示例。

## Zep Cloud 安装与设置

[Zep Cloud 文档](https://help.getzep.com)

1. 安装 Zep Cloud SDK：

::: code-group

```bash [pip]
pip install zep_cloud
```

```bash [uv]
uv add zep_cloud
```

:::

或

```bash
poetry add zep_cloud
```

## 检索器

Zep 的记忆检索器是一个 LangChain 检索器，它使您能够从 Zep 会话中检索消息，并用它们来构建您的提示。

该检索器支持对单个消息和对话摘要进行搜索。后者对于向 LLM 提供丰富而简洁的相关过去对话上下文非常有用。

Zep 的记忆检索器同时支持相似性搜索和 [最大边际相关性 (MMR) 重排序](https://help.getzep.com/working-with-search#how-zeps-mmr-re-ranking-works)。MMR 搜索有助于确保检索到的消息具有多样性，彼此之间不会过于相似。

查看 [使用示例](/oss/integrations/retrievers/zep_cloud_memorystore)。

```python
from langchain_community.retrievers import ZepCloudRetriever
```

## 向量存储

Zep 的 [文档向量存储 API](https://help.getzep.com/document-collections) 使您能够使用向量相似性搜索来存储和检索文档。Zep 不要求您理解
距离函数、嵌入类型或索引最佳实践。您只需传入分块后的文档，Zep 会处理其余的工作。

Zep 同时支持相似性搜索和 [最大边际相关性 (MMR) 重排序](https://help.getzep.com/working-with-search#how-zeps-mmr-re-ranking-works)。
MMR 搜索有助于确保检索到的文档具有多样性，彼此之间不会过于相似。

```python
from langchain_community.vectorstores import ZepCloudVectorStore
```

查看 [使用示例](/oss/integrations/vectorstores/zep_cloud)。
