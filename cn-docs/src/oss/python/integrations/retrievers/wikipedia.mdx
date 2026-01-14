---
title: 维基百科
---
>[维基百科](https://wikipedia.org/) 是一个多语言的免费在线百科全书，由志愿者社区（称为维基人）通过开放协作并使用基于维基的编辑系统 MediaWiki 编写和维护。`Wikipedia` 是历史上规模最大、阅读量最多的参考工具。

本笔记本展示了如何从 `wikipedia.org` 检索维基页面，并将其转换为下游使用的 [Document](https://python.langchain.com/api_reference/core/documents/langchain_core.documents.base.Document.html) 格式。

### 集成详情

<ItemTable category="external_retrievers" item="WikipediaRetriever" />

## 设置

要启用对单个工具的自动化追踪，请设置您的 [LangSmith](https://docs.langchain.com/langsmith/home) API 密钥：

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### 安装

该集成位于 `langchain-community` 包中。我们还需要安装 `wikipedia` Python 包本身。

```python
pip install -qU langchain-community wikipedia
```

## 实例化

现在我们可以实例化我们的检索器：

`WikipediaRetriever` 参数包括：

- 可选 `lang`：默认="en"。用于在维基百科的特定语言部分进行搜索。
- 可选 `load_max_docs`：默认=100。用于限制下载的文档数量。下载全部 100 个文档需要时间，因此实验时请使用较小的数字。目前有一个 300 的硬性限制。
- 可选 `load_all_available_meta`：默认=False。默认情况下，仅下载最重要的字段：`Published`（文档发布/最后更新日期）、`title`、`Summary`。如果为 True，则也会下载其他字段。

`get_relevant_documents()` 有一个参数 `query`：用于在维基百科中查找文档的自由文本。

```python
from langchain_community.retrievers import WikipediaRetriever

retriever = WikipediaRetriever()
```

## 使用

```python
docs = retriever.invoke("TOKYO GHOUL")
```

```python
print(docs[0].page_content[:400])
```

```text
Tokyo Ghoul (Japanese: 東京喰種（トーキョーグール）, Hepburn: Tōkyō Gūru) is a Japanese dark fantasy manga series written and illustrated by Sui Ishida. It was serialized in Shueisha's seinen manga magazine Weekly Young Jump from September 2011 to September 2014, with its chapters collected in 14 tankōbon volumes. The story is set in an alternate version of Tokyo where humans coexist with ghouls, beings who loo
```

---

## API 参考

有关 `WikipediaRetriever` 所有功能和配置的详细文档，请前往 [API 参考](https://python.langchain.com/api_reference/community/retrievers/langchain_community.retrievers.wikipedia.WikipediaRetriever.html#langchain-community-retrievers-wikipedia-wikipediaretriever)。
